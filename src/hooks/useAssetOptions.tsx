import { Item } from "@/components/core/Select";
import { useSelector } from "@/hooks/useSelector";


export function useAssetOptions(type: string) {
  const assets = useSelector((state) => state.scene.assets);
  const filteredAssets = assets.filter((a) => a.type === type);

  const filteredAssetItems: Item[] = filteredAssets.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  filteredAssetItems.unshift({
    value: "",
    label: "No asset",
    disabled: true,
  });
  return filteredAssetItems;
}
