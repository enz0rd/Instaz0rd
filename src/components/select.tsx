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
    <Select>
      <SelectTrigger className="w-[20rem]">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem value={(item.value)}>{(item.label)}</SelectItem>
        ))}
      </SelectContent>
    </Select>

  );
}
