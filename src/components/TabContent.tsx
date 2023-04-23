interface ITabContentProps {
    id: string,
    activeTab: string,
    children: JSX.Element
}

export default function TabContent({ id, activeTab, children }: ITabContentProps) {
    return (activeTab === id ? children : null);
}
