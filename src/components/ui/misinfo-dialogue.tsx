import { ShieldAlert } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";

export default function MisinformationDialogue({
  isOpen,
  setOpen,
  researchBtnClick,
}: {
  isOpen: boolean;
  setOpen: (state: boolean) => void;
  researchBtnClick: () => void;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogTrigger />

      <AlertDialogContent>
        <AlertDialogTitle className="flex gap-x-2 items-center">
          <ShieldAlert /> <span>This Post May Contains Misinformation</span>
        </AlertDialogTitle>
        <AlertDialogDescription>
          Our systems detected that this post could contain misinformation. If
          this topic is important to you, please do further research and confirm
          that the claims made in this post are valid.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={researchBtnClick}>
            How It Works
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClose}>
            Understood
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

