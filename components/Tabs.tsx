import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export interface TabsItems<TabsNames> {
  label: string;
  href: string;
  value: TabsNames;
}

export const TabsComponent = <TabsNames extends string>(props: {
  defaultValue: TabsNames;
  tabsItems: TabsItems<TabsNames>[];
  children: React.ReactNode;
}) => {
  const { defaultValue, tabsItems, children } = props;
  return (
    <Tabs defaultValue={defaultValue} className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center mt-2 mb-0 flex-shrink-0">
        <ScrollArea className="h-[70px] w-full max-w-full rounded-md">
          <TabsList>
            {tabsItems.map((tab) => (
              <TabsTrigger key={tab.href} value={tab.value} asChild>
                <Link href={tab.href} prefetch={true} passHref>
                  {tab.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {tabsItems.map((tab) => (
        <TabsContent
          key={tab.href}
          value={tab.value}
          className="flex-1 min-h-0"
        >
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};
