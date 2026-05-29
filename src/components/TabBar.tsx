export default function TabBar({
  tabs,
  activeIndex,
  onTabClick,
}: {
  tabs: string[];
  activeIndex: number;
  onTabClick: (index: number) => void;
}) {
  return (
    <div className="flex gap-4 cursor-default">
      {tabs.map((tab, i) => (
        <div
          key={i}
          onClick={() => onTabClick(i)}
          className={`px-2 py-1 select-none transition ${
            i === activeIndex
              ? "bg-white text-black shadow-[2px_2px_0px_#444]"
              : "text-terminal-green hover:underline"
          }`}
        >
          {tab.toUpperCase()}
        </div>
      ))}
    </div>
  );
}
