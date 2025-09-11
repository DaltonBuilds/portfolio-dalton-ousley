"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
 
interface TimelineEntry {
  id: string;
  title: string;
  content: React.ReactNode;
}
 
export const Timeline = ({ data, title, description }: { data: TimelineEntry[], title: string, description: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
 
  return (
    <div
      className="w-full md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 text-primary max-w-4xl break-words">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-sm">
            {description}
        </p>
      </div>
 
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex justify-start pt-10 md:pt-40 md:grid md:grid-cols-12 md:gap-10 items-start"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start md:col-span-5">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background border-2 border-primary/20 shadow-lg flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background" />
              </div>
              <h3 className="hidden md:block text-2xl md:pl-20 md:text-4xl lg:text-5xl xl:text-6xl font-bold text-muted-foreground/50 break-words">
                {item.title}
              </h3>
            </div>
 
            <div className="relative pl-20 pr-4 md:pl-0 w-full md:col-span-7">
              <h3 className="md:hidden block text-xl sm:text-2xl mb-4 text-left font-bold text-muted-foreground/50 break-words">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        {isMounted && (
          <div
            style={{
              height: height || 'auto',
            }}
            className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent from-0% via-border to-transparent to-99% [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-orange-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};
