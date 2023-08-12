import React from "react";
import { TreeViewItem } from "./TreeItem";


export const SelectedItemsContext = React.createContext<TreeViewItem<any>[]>(
  []
);
