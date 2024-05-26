import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function SelectBox({ data = [] }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Select className="bg-zinc-950 dark:bg-white text-zinc-50">
      <SelectTrigger>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent className="bg-zinc-950 dark:bg-white text-zinc-50 w-[15rem] h-[20rem] text-wrap">
        {data.map((item) => (
          <SelectItem value={(item.value)}>{(item.label)}</SelectItem>
        ))}
      </SelectContent>
    </Select>

  );
}
