import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css";
import Cookies from "js-cookie";
import axios from "axios";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DrawerComponent({ incidentNo, open, onClose }) {
const router = useRouter();
  const currentID = router.pathname;
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("N");
  const [id, setId] = useState("");

  const handleGetCookie = () => {
    const cookie = Cookies.get("username");
    setUsername(cookie || "No cookie found");
  };

  useEffect(() => {
    handleGetCookie();
  }, []);

  const handleCommentSubmit = async (comment) => {
    const commentPayload = {
      incidentNo,
      comment: {
        username: username,
        text: comment.text, // Only send the text
        replies: comment.replies, // Send replies array
        date: new Date().toISOString(),
      },
    };

    console.log("payload", commentPayload);

    try {
      await axios
        .post("/api/comment", commentPayload)
        .then((response) => {
          console.log("Comment posted successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error posting comment:", error);
        });
      //   if (response.ok) {
      //     // Handle successful comment submission, like updating the UI or state
      //   }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleGetComments = async () => {
    try {
      const response = await axios.get(
        `/api/comment?incidentNo=${incidentNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log(`Error: ${response.message}`);
      }

      const result = await response.data;
      console.log("object of result", result);
      setId(result._id);

      const transformData = (result) => {
        return result.comments.map(comment => ({
          userId: result._id, // assuming userId maps to _id of the result
          comId: comment._id,
          fullName: comment.username,
          userProfile: '/dashboard/profile', // static route as per requirement
          text: comment.text,
          avatarUrl: 'https://ui-avatars.com/api/name=' + encodeURIComponent(comment.username) + '&background=random', // generating avatar URL dynamically
          replies: []
        }));
      };

      const transformedData = transformData(result);
        console.log('transformed',transformedData);
        setData(transformedData);

    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    handleGetComments();
  }, [open]);

  

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Button onClick={handleGetComments}>get comments</Button>
      <Box sx={{ width: 700, padding: 2 }} role="presentation">
        <CommentSection
          customNoComment={() => <div>Không có bình luận</div>}
          currentUser={{
            currentUserImg:
              "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?w=826&t=st=1724820147~exp=1724820747~hmac=69da0f9454626aecd6f1d6306bfde49f777f4881e716fd9de20cba41912c1bf5",
            currentUserFullName: username,
          }}
          advancedInput={true}
          hrStyle={{ border: "0.5px solid #ff0072" }}
          commentData={data}
          logIn={{
            loginLink: "http://localhost:3001/",
            signupLink: "http://localhost:3001/",
          }}
          customImg="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?w=826&t=st=1724820147~exp=1724820747~hmac=69da0f9454626aecd6f1d6306bfde49f777f4881e716fd9de20cba41912c1bf5"
          inputStyle={{ border: "1px solid rgb(208 208 208)" }}
          formStyle={{ backgroundColor: "white" }}
          submitBtnStyle={{
            border: "1px solid black",
            backgroundColor: "black",
            padding: "7px 15px",
          }}
          cancelBtnStyle={{
            border: "1px solid gray",
            backgroundColor: "gray",
            color: "white",
            padding: "7px 15px",
          }}
          replyInputStyle={{ borderBottom: "1px solid black", color: "black" }}
          // replyInputStyle={{ display: "none" }} 
          onSubmitAction={handleCommentSubmit}
          onReplyAction={handleCommentSubmit}
        />
      </Box>
    </Drawer>
  );
}
