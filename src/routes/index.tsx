import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    // loader: (i) => {
    //     console.log("landing loader context", i.context);
    //     return i.context;
    // },
    component: Page
});

function Page() {
  return (
    <div className="flex items-center justify-center bg-green-300">
        <h1>Landing</h1>
        <Link className="border-black bg-white rounded-2xl" to="/cool">Go to Cool Page</Link>
    </div>
  )
}