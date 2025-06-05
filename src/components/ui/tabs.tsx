import * as React from "react";

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className = "", children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  // Clone children and pass activeTab to them
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<{ activeTab?: string; onTabChange?: (tab: string) => void }>, {
        activeTab: activeTab,
        onTabChange: setActiveTab,
      });
    }
    return child;
  });

  return (
    <div className={`w-full ${className}`}>
      {childrenWithProps}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({ 
  className = "", 
  children,
  activeTab,
  onTabChange
}) => {
  // Clone children and pass activeTab to them
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<{ activeTab?: string; onTabChange?: (tab: string) => void }>, {
        activeTab: activeTab,
        onTabChange: onTabChange,
      });
    }
    return child;
  });

  return (
    <div className={`flex rounded-md bg-gray-100 p-1 ${className}`}>
      {childrenWithProps}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  className = "", 
  children,
  activeTab,
  onTabChange
}) => {
  const isActive = activeTab === value;

  const handleClick = () => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <button
      className={`flex-1 px-3 py-1.5 text-sm font-medium transition-all
        ${isActive 
          ? "bg-white text-blue-700 shadow-sm rounded-md" 
          : "text-gray-600 hover:text-gray-900"}
        ${className}`}
      onClick={handleClick}
      type="button"
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  className = "", 
  children,
  activeTab
}) => {
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      className={`outline-none ${className}`}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </div>
  );
};
