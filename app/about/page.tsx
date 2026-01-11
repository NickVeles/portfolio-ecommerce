import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="space-y-8 pt-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">About This Project</h1>
            <p className="text-lg text-muted-foreground">
              This is a simple portfolio e-commerce website built with modern web
              technologies, featuring a fully functional shopping cart and
              secure payment processing powered by Stripe.
            </p>
            <p className="text-muted-foreground">
              <Link
                href="https://github.com/NickVeles/portfolio-ecommerce"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors underline"
              >
                View the source code on GitHub
              </Link>
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Connect With Me
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                href="https://nickveles.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-lg border transition-colors"
              >
                <LinkIcon className="size-6 text-primary group-hover:text-secondary transition-colors" />
                <span className="text-lg text-primary group-hover:text-secondary transition-colors">
                  nickveles.com
                </span>
              </Link>

              <Link
                href="https://github.com/NickVeles/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-lg border transition-colors"
              >
                <FontAwesomeIcon
                  icon={faGithub}
                  className="size-6 text-primary group-hover:text-secondary transition-colors"
                />
                <span className="text-lg text-primary group-hover:text-secondary transition-colors">
                  GitHub
                </span>
              </Link>

              <Link
                href="https://www.linkedin.com/in/nickveles/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-lg border transition-colors"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="size-6 text-primary group-hover:text-secondary transition-colors"
                />
                <span className="text-lg text-primary group-hover:text-secondary transition-colors">
                  LinkedIn
                </span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
