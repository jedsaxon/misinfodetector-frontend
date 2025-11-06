import { ShieldAlert, X, Link2 } from "lucide-react";
import type { Post } from "@/services/posts-service";
import { Button } from "./button";
import { Separator } from "./separator";

interface MisinformationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

function calculateAccuracy(post: Post): number {
  return post.potentialMisinformation ? 67 : 85;
}

function PanelContent({ post, onClose }: { post: Post; onClose: () => void }) {
  const accuracy = calculateAccuracy(post);
  const accuracyColor =
    accuracy >= 70
      ? "text-green-500"
      : accuracy >= 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 sm:p-6 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
            <ShieldAlert className="size-5 text-destructive" />
          </div>
          <h2 className="font-bold text-base sm:text-lg text-foreground">
            Misinformation Analysis
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive rounded-xl"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Accuracy Score */}
          <div className="flex flex-col items-center justify-center py-4">
            <div
              className={`text-5xl md:text-6xl font-bold ${accuracyColor} mb-2`}
            >
              {accuracy}%
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Accuracy
            </div>
          </div>

          <Separator className="rounded-full" />

          {/* User Credibility Section */}
          <div className="space-y-3">
            <div className="inline-block px-3 py-1.5 rounded-full bg-muted/80 border border-border/50 shadow-sm">
              <span className="text-sm font-medium text-foreground">
                User Credibility:
              </span>
            </div>
            <div className="text-sm text-foreground/90 leading-relaxed pl-1">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                consequat dui eget leo pellentesque faucibus. In hac habitasse
                platea dictumst. Sed id enim iaculis, posuere turpis vel,
                venenatis ante. Praesent dapibus mollis cursus. Suspendisse sit
                amet ornare orci, eu pharetra nunc. Maecenas fermentum diam sit
                amet urna egestas finibus. Etiam.
              </p>
            </div>
          </div>

          <Separator className="rounded-full" />

          {/* Date Comparison Section */}
          <div className="space-y-3">
            <div className="inline-block px-3 py-1.5 rounded-full bg-muted/80 border border-border/50 shadow-sm">
              <span className="text-sm font-medium text-foreground">
                Date Comparison:
              </span>
            </div>
            <div className="text-sm text-foreground/90 leading-relaxed pl-1">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent hendrerit pretium aliquet. Duis pharetra vehicula
                ullamcorper. Nulla mollis quam quis turpis cursus pulvinar. Ut
                ultrices posuere suscipit. Nunc scelerisque maximus est vitae
                tincidunt. Morbi ac ex est. Donec efficitur metus non neque
                vestibulum, eu posuere orci fermentum. Vestibulum suscipit
                tincidunt.
              </p>
            </div>
          </div>

          <Separator className="rounded-full" />

          {/* Information Accuracy Section */}
          <div className="space-y-3">
            <div className="inline-block px-3 py-1.5 rounded-full bg-muted/80 border border-border/50 shadow-sm">
              <span className="text-sm font-medium text-foreground">
                Information Accuracy:
              </span>
            </div>
            <div className="text-sm text-foreground/90 leading-relaxed pl-1">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus gravida, neque nec tempus tempor, magna dolor
                consectetur dolor, id tempor nisl metus at augue. Curabitur nec
                congue sem. Nulla gravida mi quis risus convallis pulvinar.
                Integer non massa in magna pretium rutrum. Pellentesque
                condimentum ex accumsan ante tincidunt porttitor. Ut.
              </p>
            </div>
          </div>

          <Separator className="rounded-full" />

          {/* Discover More Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Discover More
              </span>
            </div>
            <div className="space-y-3 pl-2">
              <a
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30 text-primary font-medium text-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="p-1.5 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Link2 className="size-4" />
                </div>
                <span>Placeholder</span>
              </a>
              <a
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30 text-primary font-medium text-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="p-1.5 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Link2 className="size-4" />
                </div>
                <span>Placeholder 2</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MisinformationPanel({
  isOpen,
  onClose,
  post,
}: MisinformationPanelProps) {
  if (!post || !isOpen) return null;

  return (
    <>
      {/* Backdrop overlay - dimming without blur */}
      <div
        className={`
          fixed inset-0 bg-black/30 z-30
          transition-opacity duration-300 ease-in-out
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel - Sidebar on all devices */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full sm:w-[420px] bg-background
          transition-transform duration-300 ease-in-out z-40
          shadow-2xl border-l border-l-border rounded-tl-2xl
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <PanelContent post={post} onClose={onClose} />
      </div>
    </>
  );
}
