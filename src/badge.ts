import { log } from "matchstick-as";
import {
	ProtocolSettingsUpdated,
	Badge,
	BadgeRequested,
} from "../generated/Badge/Badge";
import { ProtocolConfig } from "../generated/schema";

export function handleProtocolSettingsUpdated(
	event: ProtocolSettingsUpdated
): void {
	const theBadgeAddress = event.address;
	const theBadge = Badge.bind(theBadgeAddress);
	const tbSTore = theBadge.try__badgeStore();

	if (!tbSTore.reverted) {
		let protocolConfigs = ProtocolConfig.load(tbSTore.value);

		if (!protocolConfigs) {
			protocolConfigs = new ProtocolConfig(tbSTore.value);
		}

		protocolConfigs.address = tbSTore.value;
		protocolConfigs.save();
	} else {
		log.warning("try__badgeStore reverted: {}", [
			event.transaction.hash.toHexString(),
		]);
	}
}
