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
    <Select className="bg-slate-950 dark:bg-white text-slate-50">
      <SelectTrigger>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent className="bg-slate-950 dark:bg-white text-slate-50">
        {data.map((item) => (
          <SelectItem value={(item.value)}>{(item.label)}</SelectItem>
        ))}
      </SelectContent>
    </Select>

  );
}
