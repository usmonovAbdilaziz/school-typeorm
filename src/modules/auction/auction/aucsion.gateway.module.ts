import { Module } from "@nestjs/common";
import { AucsionModule } from "../../../aucsion/aucsion.module";
import { AucsionResaultsModule } from "../../../aucsion_resaults/aucsion_resaults.module";
import { BitHistoryModule } from "../../../bit_history/bit_history.module";
import { AuctionGateway } from "./auction.gateway";

@Module({
    imports:[AucsionModule,BitHistoryModule,AucsionResaultsModule],
    controllers:[AuctionGateway]
})
export class AucsionGateway{}