// import Comment from "@/model/Comment";
// import dbConnect from "@/utils/mongodb";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//     dbConnect();
//     try {
//         const body = await request.json();
//         const { userId, comId, text, dateOfReply, username} = body;
//         console.log(userId)
//         console.log(comId)
//         console.log(text)
//         console.log(dateOfReply)
//         console.log(username)

//         const comment = await Comment.findOne({ _id: userId });
//         console.log(comment);
//         return NextResponse.json({message: "reply saved"},{status: 200});
//     } catch (error) {
//         return NextResponse.json({message: "an error while saving reply"}, {status: 500});
//     }
// }

import Comment from "@/model/Comment";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect(); // Ensure the database connection is established

    try {
        const body = await request.json();
        const { userId, comId, text, dateOfReply, username } = body;

        // Log the incoming data for debugging
        console.log("User ID:", userId);
        console.log("Comment ID:", comId);
        console.log("Reply Text:", comId.text);
        console.log("Date of Reply:", dateOfReply);
        console.log("Username:", username);

        // Find the document containing the comment
        const commentDocument = await Comment.findOne({ _id: userId,  "comments._id": comId.comId });

        if (!commentDocument) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        console.log('commentDocument', commentDocument)
//         const comm= commentDocument.comments;
//         console.log(comm)

//         if (comId.comId === comm._id) { console.log('object'); }

//         const matchingComment = commentDocument.comments.find((comment) => comment._id.equals(comId.comId));

// if (matchingComment) {
//     // Do something with the matching comment
//     console.log('Matching comment:', matchingComment);
// } else {
//     console.log('Comment not found in the comments array');
// }

//         // Find the specific comment in the comments array using comId
//         // const commentIndex = commentDocument.comments.findIndex(comment => comment._id.toString() === comId);
//         const commentIndex = commentDocument.comments.findOne({ 
//             _id: comId.comId
//         })

//         console.log('object', commentIndex)

//         if (commentIndex === -1) {
//             return NextResponse.json({ message: "Specific comment not found" }, { status: 404 });
//         }

//         // Append the reply to the replies array of the found comment
//         commentDocument.comments[commentIndex].replies.push({
//             username,
//             text,
//             date: dateOfReply
//         });

//         // Save the updated document
//         await commentDocument.save();

        return NextResponse.json({ message: "Reply saved successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error while saving reply:", error);
        return NextResponse.json({ message: "An error occurred while saving the reply" }, { status: 500 });
    }
}
