import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { BrainCircuit, Send, ShieldAlert } from "lucide-react";
import z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { DetailedApiError, ApiResponse } from "@/services/api-utils";
import { uploadPost, type Post } from "@/services/posts-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const pageFormSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty.")
    .max(256, "Message cannot have more than 256 characters."),
  username: z
    .string()
    .min(1, "Username cannot be empty")
    .max(64, "Username cannot have more than 64 characters."),
  dna: z.boolean().refine((val) => val === true, {
    message: "You must give up your privacy to use this site.",
  }),
});

export default function NewPostPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<DetailedApiError | undefined>(
    undefined,
  );

  const handleFormCancel = () => {
    navigate("/");
  };

  const handleFormSubmit = async (data: z.infer<typeof pageFormSchema>) => {
    const response = await uploadPost(data.message, data.username);
    if (response instanceof DetailedApiError) {
      setApiError(response);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Header>
        <SidebarTrigger />
        <VerticalSeparator />
        <Send className="mx-1" color="#c061cb" /> New Post
      </Header>
      <div className="w-fit mx-auto my-3">
        <NewPostForm
          onFormSubmit={handleFormSubmit}
          onFormCancel={handleFormCancel}
        />
      </div>
      <ApiErrorDialogue
        title={apiError?.title ?? ""}
        message={apiError?.description ?? ""}
        isOpen={apiError != undefined}
        setOpen={(o) => {
          if (o == true) return; // this modal can only be opened with an error
          setApiError(undefined);
        }}
        closeBtnClick={() => setApiError(undefined)}
      />
    </>
  );
}

export function NewPostForm({
  onFormSubmit,
  onFormCancel,
}: {
  onFormSubmit: (data: z.infer<typeof pageFormSchema>) => void;
  onFormCancel?: () => void;
}) {
  const form = useForm<z.infer<typeof pageFormSchema>>({
    resolver: zodResolver(pageFormSchema),
    mode: "onSubmit",
    defaultValues: {
      message: "",
      username: "",
      dna: false as true | false,
    },
  });

  return (
    <Card style={{ width: "512px" }}>
      <CardHeader>
        <CardTitle>New Post Submission</CardTitle>
        <CardDescription>
          We really, really need your personal information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="new-post-form" onSubmit={form.handleSubmit(onFormSubmit)}>
          <FieldGroup>
            {/* ----- POST INPUT FIELD ----- */}
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-post-form-post">Message</FieldLabel>
                  <Textarea
                    {...field}
                    id="new-post-form-post"
                    aria-invalid={fieldState.invalid}
                    placeholder="I think that using machine learning to detect misinformation will causes more harm than good"
                    autoComplete="off"
                    rows={6}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* ----- USERNAME FIELD ----- */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-post-form-post">Username</FieldLabel>
                  <Input
                    {...field}
                    id="new-post-form-post"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* ----- DNA SAMPLE FIELD ----- */}
            <Controller
              name="dna"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend>Security</FieldLegend>
                  <FieldDescription>
                    In some countries, you are required to submit a DNA sample
                    to our labs to ensure that you are over the age of 16.
                  </FieldDescription>
                  <FieldGroup data-slot="checkbox-group">
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id="new-post-form-dna"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel htmlFor="new-post-form-dna">
                        DNA Sample Provided
                      </FieldLabel>
                    </Field>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldGroup>
                </FieldSet>
              )}
            />
            {/* ----- END FIELDS ----- */}
            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Button variant="outline" type="button" onClick={onFormCancel}>
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

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
