import Image from "next/image"
import Link from "next/link"

const widgets = [
  { title: "Auto Screenshotter", image: "/Pictures/screen-capture.png", slug: "autoscreen" },
  { title: "Calendar", image: "/placeholder.svg?height=200&width=240", slug: "calendar" },
  { title: "Messages", image: "/placeholder.svg?height=200&width=240", slug: "messages" },
  { title: "Tasks", image: "/placeholder.svg?height=200&width=240", slug: "tasks" },
  { title: "Files", image: "/placeholder.svg?height=200&width=240", slug: "files" },
  { title: "Settings", image: "/placeholder.svg?height=200&width=240", slug: "settings" },
]

export default function WidgetSelector() {
  return (
    <div className="flex items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-7xl  rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Select a Tool
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {widgets.map((widget, index) => (
              <Link
                key={index}
                href={`/tool/${widget.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 p-1 transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                <div className="relative flex flex-col items-center p-6 bg-gray-800 rounded-xl">
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <Image
                      src={widget.image || "/placeholder.svg"}
                      alt={widget.title}
                      width={240}
                      height={200}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <span className="text-xl font-semibold text-gray-100 group-hover:text-white transition-colors duration-300">
                    {widget.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

