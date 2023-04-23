import { useState } from "react";

interface ITabsProps {
  tabs: string[],
  onTabChange: (tab: string) => void
}

export default function Tabs({ tabs, onTabChange }: ITabsProps) {
    const [activeTab, setActiveTab] = useState(tabs.length ? tabs[0] : null);
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        onTabChange(tab);
    }

    return (
        <nav>
          <ul className="nav">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  onClick={() => handleTabChange(tab)}
                  className={`nav-link ${tab === activeTab ? 'active' : ''}`}>
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )
}
