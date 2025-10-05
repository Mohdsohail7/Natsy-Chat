const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");


exports.sendFriendRequest = async (req, res) => {
    try {
        const fromUserId = req.user.id; // from authmiddleware
        const { toUsername } = req.body;

        if (!toUsername) {
             return res.status(400).json({ message: "Recipient username is required."});
        }

        // get sender user
        const fromUser = await User.findById(fromUserId);
        if (!fromUser) {
            return res.status(404).json({ message: "Sender not found."});
        }

        // check verification
        if (!fromUser.isVerified) {
            return res.status(403).json({ message: "You must verify your email before sending requests"});
        }

        if (fromUser.username === toUsername) {
            return res.status(400).json({ message: "You cannot send a request to yourself." });
        }

        // check if request already exists
        const existing = await FriendRequest.findOne({
            from: fromUserId,
            toUsername: toUsername,
            status: "pending",
        });

        if (existing) {
            return res.status(400).json({ message: "Friend request already sent."});
        }

        // create new request
        const request = new FriendRequest({
            from: fromUserId,
            toUsername: toUsername,
            status: "pending",
        });
        await request.save();

        return res.status(201).json({ message: "Friend request sent successfully."});

    } catch (error) {
        console.error("Friend request error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

exports.responseFriendRequest = async(req, res) => {
    try {
        const userId = req.user.id; // logged-in user (receiver)
        const { requestId, action } = req.body // action = "accept" / "reject"

        // found sender
        const user = await User.findById(userId);

        // find request
        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Friend request not found."});
        }

        // Ensure the logged-in user is the recipient
        if (request.toUsername !== user.username) {
            return res.status(403).json({ message: "Not authorized to respond to this request." });
        }

        // Handle accept
        if (action === "accept") {
            request.status = "accepted";
            request.to = userId;
            await request.save();

            // add each other as friends
            await User.findByIdAndUpdate(request.from, { $addToSet: {friends: userId }});
            await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from }});

            return res.json({ message: "Friend request accepted."});
        }

        // Handle reject
        if (action === "reject") {
            request.status = "rejected";
            await request.save();
            return res.json({ message: "Friend request rejected."});
        }

        return res.status(400).json({ message: "Invalid action."});
    } catch (error) {
        console.error("Respond request error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}