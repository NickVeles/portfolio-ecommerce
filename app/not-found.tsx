import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center space-y-6 pt-6">
          <div className="flex justify-center">
            <FileQuestion className="size-12 text-muted-foreground" />
          </div>

          <h1 className="text-3xl font-bold">Page Not Found (404)</h1>

          <p className="text-xl text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              Check the URL or return to the home page to find what you need.
            </p>
            <Button asChild variant="default">
              <Link href="/">Go Back Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
