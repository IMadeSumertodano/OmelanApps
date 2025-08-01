import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DatePicker } from "@/components/order-page/DatePicker";
import { Link } from "react-router-dom";
import { CaregiverDetailModal } from "@/components/order-page/CaregiverDetailModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Loader } from "@/components/global/LoaderScreen";
import { searchCaregiversByDateAvailableDB } from "@/utils/api";

export default function CaregiverOrderPage() {
  const [caregivers, setCaregivers] = useState();
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);

  const handleSearch = async () => {
    if (!date) return;

    setLoading(true);
    setCaregivers([]);
    setShowAvailable(false);

    try {
      // Use local date, not UTC date
      const formattedDate = date.toLocaleDateString("en-CA");

      const { status, data } = await searchCaregiversByDateAvailableDB(
        formattedDate
      );

      setCaregivers(data?.partners || []);
      setShowAvailable(true);
    } catch (err) {
      // console.log(err);

      const errMessage = err?.response?.data?.message || err?.message || "";
      if (errMessage.includes("no match schedule")) {
        setCaregivers([]);
        setShowAvailable(true);
      } else {
        alert("Terjadi kesalahan saat mengambil data caregiver.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <div className="text-center mb-4">
        <div className="dark:border relative overflow-hidden w-full dark bg-background text-foreground max-w-screen-lg mx-auto rounded-2xl py-10 md:py-16 px-6 md:px-14">
          <div className="relative z-0 flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-semibold">
              Pesan Caregiver
            </h1>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilih Tanggal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DatePicker date={date} setDate={setDate} />
          <Button onClick={handleSearch} className="w-full mt-2">
            {loading ? <Loader /> : "Cari Caregiver Tersedia"}
          </Button>
        </CardContent>
      </Card>

      {showAvailable && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Caregiver Tersedia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dummy nurse list (bisa diganti dengan fetch dari API) */}
            {caregivers.length == 0 && <p>Tidak ada caregiver tersedia.</p>}
            {caregivers.length !== 0 &&
              caregivers.map((caregiver) => (
                <div
                  key={caregiver.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={caregiver.photo_url} />
                      <AvatarFallback>AN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{caregiver.fullname}</p>
                      <p className="text-sm text-muted-foreground">
                        Berpengalaman + tahun merawat lansia
                      </p>
                      <p className="text-sm text-gray-500">
                        {caregiver.specialist}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {caregiver.address}
                      </p>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                        <Star
                          size={16}
                          className="fill-yellow-400 stroke-yellow-500"
                        />
                        {parseFloat(caregiver.average_rating).toFixed(2) ||
                          "Belum ada rating"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CaregiverDetailModal
                      caregiver={caregiver}
                      selectedDate={date}
                    />
                    <Link
                      to="/konfirmasi-pesanan"
                      state={{ caregiver, selectedDate: date }}
                    >
                      <Button variant="outline">Pilih</Button>
                    </Link>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
