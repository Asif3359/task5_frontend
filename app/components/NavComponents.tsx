import React from "react";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";

function NavComponents() {
  return (
    <div>
      <NativeSelect className="rounded-xs">
        <NativeSelectOption value="">Select Language</NativeSelectOption>
        <NativeSelectOption value="en-US">{`Language \n English US`}</NativeSelectOption>
        <NativeSelectOption value="de-DE">Germany</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

export default NavComponents;
