import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { DeleteAccountButton } from "@/features/auth/components/DeleteAccountButton";

export default async function PeoplePage() {
  return (
    <div>
      <p>Coming soon</p>

      <div className="mt-10 flex items-center justify-between border-t border-surface-border pt-5">
        <LogoutButton />
        <DeleteAccountButton />
      </div>
    </div>
  );
}
