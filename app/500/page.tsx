import Link from "next/link";
import { ServerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ServerError() {
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center space-y-6 pt-6">
          <div className="flex justify-center">
            <ServerOff className="size-12 text-destructive" />
          </div>

          <h1 className="text-3xl font-bold">Server Error (500)</h1>

          <p className="text-xl text-muted-foreground">
            Something went wrong on our end. Please try again later.
          </p>

          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              If the problem persists, please contact support.
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
