import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cool")({
    // loader: (i) => {
    //     console.log("cool loader context", i.context);
    // },
    component: Page
});

function Page() {
  return (
    <div className="flex items-center justify-center bg-green-300">
        <h1>Cool</h1>
        <Link className="border-black bg-white rounded-2xl" to="/">Go to Landing Page</Link>
    </div>
  )
}