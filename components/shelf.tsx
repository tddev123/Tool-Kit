import Link from "next/link";
import { Camera, Calendar, Video, CheckSquare, Folder, Settings, Play } from "lucide-react";

const widgets = [
  {
    title: "Auto Screenshotter",
    slug: "autoscreen",
    icon: Camera,
    color: "text-teal-400",
    data: "Last: 2m ago",
  },
  {
    title: "Youtube to MP3/WAV",
    slug: "YoutubeConverter",
    icon: Play,
    color: "text-blue-400",
    data: "3 events today",
  },
  {
    title: "Video Editor",
    slug: "videoeditor",
    icon: Video,
    color: "text-green-400",
    data: "5 unread",
  },
  {
    title: "Tasks",
    slug: "tasks",
    icon: CheckSquare,
    color: "text-purple-400",
    data: "2 due today",
  },
  {
    title: "Files",
    slug: "files",
    icon: Folder,
    color: "text-amber-400",
    data: "12 GB free",
  },
  {
    title: "Settings",
    slug: "settings",
    icon: Settings,
    color: "text-red-400",
    data: "2 updates",
  },
];

export default function WidgetSelector() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-16 text-center text-white">Select a Tool</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {widgets.map((widget, index) => (
            <Link
              key={index}
              href={`/tool/${widget.slug}`}
              className="group relative rounded-2xl overflow-hidden backdrop-blur-md bg-gray-800 bg-opacity-50 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[120px] flex items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center p-4">
                <widget.icon
                  className={`w-8 h-8 mb-2 ${widget.color} group-hover:text-white transition-colors duration-300`}
                />
                <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors duration-300 text-center mb-2">
                  {widget.title}
                </span>
                <span className="text-xs text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                  {widget.data}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}