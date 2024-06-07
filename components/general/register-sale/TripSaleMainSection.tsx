import SaleTabSection from "./SaleTabSection";
import { Button } from "@/components/ui/button";
import PassengersByTrip from "./PassengersByTrip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TabSaleNavigationProps {
  tripId: number;
  onCancel: () => void;
}

const TripSaleMainNavigation: React.FC<TabSaleNavigationProps> = ({
  tripId,
  onCancel,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-800">Registrar venta</h2>
        </div>
        <div className="ml-2">
          <PassengersByTrip tripId={tripId}></PassengersByTrip>
        </div>
        <div className="ml-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"}>Cancelar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>¿Desea cancelar esta venta?</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Todos los cambios relizados en esta venta se perderán.
              </DialogDescription>
              <DialogFooter>
                <div className="flex justify-between space-x-2">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <DialogTrigger>
                    <Button variant="destructive" onClick={onCancel}>
                      Confirmar
                    </Button>
                  </DialogTrigger>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="p-1"></div>
      <SaleTabSection tripId={tripId}></SaleTabSection>
    </div>
  );
};

export default TripSaleMainNavigation;
