"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Skeleton for the main timer display
export function TimerSkeleton() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center relative">
        {/* Ears skeleton */}
        <Skeleton className="w-32 xl:w-96 h-32 xl:h-48 mb-4" />

        {/* Timer display skeleton */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-16 w-48 sm:h-24 sm:w-60 md:h-28 md:w-72 lg:h-32 lg:w-80 xl:h-36 xl:w-96" />
          <Skeleton className="h-6 w-40 sm:h-8 sm:w-48 md:h-10 md:w-56 lg:h-12 lg:w-64 xl:h-14 xl:w-72" />

          {/* Cycle info skeleton */}
          <div className="flex items-center gap-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Controls skeleton */}
        <div className="flex gap-2 mt-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for tasks list
export function TasksSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
        <Skeleton className="h-9 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

// Skeleton for quick notes
export function QuickNotesSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
        <Skeleton className="h-9 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

// Skeleton for stats
export function StatsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

// Skeleton for user data
export function UserDataSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// Generic loading component
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-muted border-t-foreground`} />
    </div>
  );
}