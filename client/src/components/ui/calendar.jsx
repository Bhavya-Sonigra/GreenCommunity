import * as React from "react"

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { isSameDay, addDays, subDays } from 'date-fns';


import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  streakDays = [], // Accept streakDays as a prop
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()


  // --- MODIFIERS FOR STREAK LOGIC ---
  const isDateInArray = (date, dates) => dates.some(d => isSameDay(d, date));

  const streakModifiers = {
    streak: streakDays,
    streak_start: (day) => {
      const inStreak = isDateInArray(day, streakDays);
      const prevNotStreak = !isDateInArray(subDays(day, 1), streakDays);
      const nextNotStreak = !isDateInArray(addDays(day, 1), streakDays);
      // Single day streak: both ends rounded
      if (inStreak && prevNotStreak && nextNotStreak) return true;
      // Start of multi-day streak: only left rounded
      return inStreak && prevNotStreak;
    },
    streak_end: (day) => {
      const inStreak = isDateInArray(day, streakDays);
      const prevInStreak = isDateInArray(subDays(day, 1), streakDays);
      const nextNotStreak = !isDateInArray(addDays(day, 1), streakDays);
      // End of multi-day streak: only right rounded
      return inStreak && prevInStreak && nextNotStreak;
    },
    streak_middle: (day) => isDateInArray(day, streakDays) && isDateInArray(subDays(day, 1), streakDays) && isDateInArray(addDays(day, 1), streakDays),
  };


  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      modifiers={streakModifiers}
      className={cn(
        "bg-background group/calendar p-4 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent rounded-xl shadow-sm",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between mb-2",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none hover:bg-green-50 hover:text-green-700 transition-colors",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none hover:bg-green-50 hover:text-green-700 transition-colors",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) font-semibold text-green-800",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute bg-popover inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn("select-none font-semibold", captionLayout === "label"
          ? "text-base text-green-800"
          : "rounded-md pl-2 pr-1 flex items-center gap-1 text-base h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5", defaultClassNames.caption_label),
        table: "w-full border-collapse mt-1",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-green-700 rounded-md flex-1 font-medium text-[0.85rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-3", defaultClassNames.week),
        week_number_header: cn("select-none w-(--cell-size)", defaultClassNames.week_number_header),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn("rounded-l-md bg-accent", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-green-50 text-green-800 rounded-md data-[selected=true]:rounded-none font-medium",
          defaultClassNames.today
        ),
        outside: cn(
          "text-gray-300 aria-selected:text-gray-300",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (<div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />);
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (<ChevronLeftIcon className={cn("size-4", className)} {...props} />);
          }

          if (orientation === "right") {
            return (<ChevronRightIcon className={cn("size-4", className)} {...props} />);
          }

          return (<ChevronDownIcon className={cn("size-4", className)} {...props} />);
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div
                className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props} />
  );
}


function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  const isStreak = modifiers.streak;
  const isStart = modifiers.streak_start;
  const isEnd = modifiers.streak_end;
  const isMiddle = modifiers.streak_middle;
  // If both start and end, it's a single-day streak
  const isSingle = isStart && isEnd;
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative flex items-center justify-center aspect-square w-full min-w-(--cell-size) font-medium text-base transition-all duration-200 overflow-hidden hover:scale-105",
        // Add ring-inset to all buttons to maintain consistent sizing
        "ring-inset",

        // Base styling for non-streak, non-selected days
        !isStreak && !modifiers.selected &&
        "hover:bg-green-50 hover:text-green-700",

        // Streak styling - applied to all streak days
        isStreak &&
        "bg-green-100 text-green-800 z-0 shadow-sm",

        // Rounded corners for streak days
        isStart && !isEnd &&
        "rounded-l-xl",
        isEnd && !isStart &&
        "rounded-r-xl",
        isStart && isEnd &&
        "rounded-xl",
        isMiddle &&
        "rounded-none",

        // Selected day styling - only apply border/ring to maintain streak background
        modifiers.selected && isStreak &&
        "ring-1 ring-green-100 z-10 font-bold shadow-md",

        // Selected day styling for non-streak days
        modifiers.selected && !isStreak &&
        "bg-white text-green-700 ring-2 ring-green-500 z-10 font-bold shadow-md",

        defaultClassNames.day,
        className
      )}
      {...props}
    >
      <span className="z-10">{day.date.getDate()}</span>
    </Button>
  );
}


export { Calendar, CalendarDayButton }