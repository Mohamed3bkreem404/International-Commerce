"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { AuthShell } from "@/components/shared/auth-shell";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUpMutation } from "@/hooks/use-auth";
import { useApiError } from "@/hooks/use-api-error";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  userName: z
    .string()
    .min(1, "Username is required")
    .max(20, "Username must be 20 characters or less"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(20, "Password must be 20 characters or less"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const handleError = useApiError();
  const signUpMutation = useSignUpMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await signUpMutation.mutateAsync(values);
      toast.success("Account created successfully. Please log in.");
      router.push("/login");
    } catch (error) {
      handleError(error, "Sign up failed.");
    }
  };

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <AuthShell
        title="Create your account"
        description="Set up your profile and start with a modern global commerce experience."
        footerLabel="Already registered?"
        footerLink="Sign in"
        footerHref="/login"
      >
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="new_user" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full"
            >
              {signUpMutation.isPending ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </AuthShell>
    </motion.div>
  );
}
