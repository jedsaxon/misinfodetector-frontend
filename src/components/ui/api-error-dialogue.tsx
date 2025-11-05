import { ShieldAlert } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";

export function ApiErrorDialogue({
  isOpen,
  setOpen,
  title,
  message,
  closeBtnClick,
}: {
  isOpen: boolean;
  title: string;
  message?: string;
  setOpen: (state: boolean) => void;
  closeBtnClick: () => void;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogTrigger />

      <AlertDialogContent>
        <AlertDialogTitle className="flex gap-x-2 items-center">
          <ShieldAlert /> <span>{title}</span>
        </AlertDialogTitle>
        {message && <AlertDialogDescription>{message}</AlertDialogDescription>}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeBtnClick}>
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
