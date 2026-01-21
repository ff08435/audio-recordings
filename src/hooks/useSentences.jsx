import yasin from "../data/sentences_yasin.json";
import hunza from "../data/sentences_hunza.json";
import { useUser } from "../context/UserContext";

export function useSentences() {
  const { user } = useUser();

  if (!user) return null;

  return user.dialect === "yasin" ? yasin : hunza;
}
