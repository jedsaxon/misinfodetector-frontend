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
import { Textarea } from "@/components/ui/textarea";

export const pageFormSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty.")
    .max(256, "Message cannot have more than 256 characters."),
  username: z
    .string()
    .min(1, "Username cannot be empty.")
    .max(64, "Username cannot have more than 64 characters."),
  dna: z.boolean().refine((val) => val === true, {
    message: "You must give up your privacy to use this site.",
  }),
});

export default function NewPostForm({
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
