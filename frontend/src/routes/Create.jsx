import { CreatePost } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const Create = ({ setIsCreatePostModelOpen }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isPostTweetOpen, setIsPostTweetOpen] = useState(false);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);

  return (
    <>
      <Dialog defaultOpen>
        <DialogOverlay className={"opacity-50 bg-black/80"} />
        <DialogContent
          onInteractOutside={() => {
            setIsCreatePostModelOpen(false);
          }}
          className={"w-fit min-w-60"}
        >
          <DialogHeader>
            <DialogTitle className={"text-center"}>Create</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            <Button
              variant={"ghost"}
              className={
                "focus-visible:ring-0 w-full cursor-pointer font-normal"
              }
              onClick={() => setIsCreatePostOpen(true)}
            >
              Create Post
              {/* Opens Create Post Interface */}
              {isCreatePostOpen && (
                <CreatePost
                  open={isCreatePostOpen}
                  setOpen={setIsCreatePostOpen}
                  handleMainDialog={setIsCreatePostModelOpen}
                />
              )}
            </Button>
            <Button
              variant={"ghost"}
              className={
                "focus-visible:ring-0 w-full cursor-pointer font-normal"
              }
              onClick={() => setIsPostTweetOpen(true)}
            >
              Post Tweet
              {/* TODO: Create & Opens Add Tweet Interface */}
            </Button>
            <Button
              variant={"ghost"}
              className={
                "focus-visible:ring-0 w-full cursor-pointer font-normal"
              }
              onClick={() => setIsAddStoryOpen(true)}
            >
              Add Story
              {/* TODO: Create & Opens Add Story Interface */}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Create;
