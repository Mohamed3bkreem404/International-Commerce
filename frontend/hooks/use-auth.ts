"use client";

import { useMutation } from "@tanstack/react-query";

import { login, signUp } from "@/services/auth.service";

export function useSignUpMutation() {
  return useMutation({
    mutationFn: signUp,
  });
}

export function useLogInMutation() {
  return useMutation({
    mutationFn: login,
  });
}
