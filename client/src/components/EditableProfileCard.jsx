import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { uploadPhoto } from "@/utils/api";

export const EditableProfileCard = ({ profile, onSave, role }) => {
  const [formData, setFormData] = useState({
    fullname: profile.fullname || "",
    phone_number: profile.phone_number || "",
    address: profile.address || "",
    biodata: profile.biodata || "",
    photo_url: profile.photo_url || "",
    dob: profile.dob || "",
    gender: profile.gender || "",
    experience: profile.experience || "",
    partner_name: profile.partner_name || "",
    emergency_contact: profile.emergency_contact || "",
    age: profile.age || undefined,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(
    profile?.photo_url || ""
  );

  useEffect(() => {
    if (profile) {
      setFormData({
        fullname: profile.fullname || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        biodata: profile.biodata || "",
        photo_url: profile.photo_url || "",
        dob: profile.dob || "",
        gender: profile.gender || "",
        partner_name: profile.partner_name || "",
        emergency_contact: profile.emergency_contact || "",
        experience: profile.experience || "",
        age: profile.age || undefined,
      });
      setPreviewPhotoUrl(profile.photo_url || "");
      setSelectedFile(null);
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (previewPhotoUrl && previewPhotoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewPhotoUrl);
      }
    };
  }, [previewPhotoUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: value,
      };

      if (name === "dob" && value) {
        const birthDate = new Date(value);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          newFormData.age = age < 0 ? 0 : age;
        } else {
          newFormData.age = undefined;
        }
      }
      return newFormData;
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewPhotoUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewPhotoUrl(formData.photo_url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalPhotoUrl = formData.photo_url;

    if (selectedFile) {
      try {
        const uploadResult = await uploadPhoto(selectedFile);

        finalPhotoUrl = uploadResult.url;
      } catch (uploadError) {
        alert("Gagal mengunggah foto: " + uploadError.message);
        return;
      }
    }

    const dataToSave = {
      fullname: formData.fullname,
      phoneNumber: formData.phone_number,
      address: formData.address,
      biodata: formData.biodata,
      photoUrl: finalPhotoUrl,
      age: formData.age,
    };
    if (role === "caregiver") {
      //
      dataToSave.experience = formData.experience; //
    }
    if (role === "caretaker") {
      //
      dataToSave.partnerName = formData.partner_name; //
      dataToSave.emergencyContact = formData.emergency_contact; //
    }
    // console.log(
    //   "Data yang akan disimpan ke API (sesuai schema Joi):",
    //   dataToSave
    // );

    onSave(dataToSave);
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Memuat profil atau data tidak tersedia.
      </p>
    );
  }

  return (
    <div className="space-y-2 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Profil</h2>
        <Button variant="outline" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? "Batal" : "Edit"}
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="flex flex-col items-center gap-4 p-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={previewPhotoUrl || formData.photo_url || ""} />
            <AvatarFallback className="text-5xl bg-blue-100 text-blue-700">
              {formData.fullname?.[0]}
            </AvatarFallback>
          </Avatar>
          {isEditing ? (
            <>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <label className="text-base font-medium text-muted-foreground w-full max-w-md">
                Biodata
              </label>
              <textarea
                className="w-full max-w-md rounded-md border border-gray-300 text-sm shadow-sm focus:outline-none focus:ring-2 p-2 focus:ring-blue-500"
                rows={5}
                name="biodata"
                value={formData.biodata || ""}
                onChange={handleChange}
              />
            </>
          ) : (
            formData.biodata && (
              <div>
                <label className="text-base font-medium text-muted-foreground w-full max-w-md text-left p-2">
                  Biodata
                </label>
                <p className="text-sm text-gray-700 text-justify p-2 max-w-md">
                  {formData.biodata}
                </p>
              </div>
            )
          )}
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
          {renderFields(role, formData, isEditing, handleChange)}
        </div>
      </div>

      {isEditing && (
        <>
          <Separator />
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Simpan</Button>
          </div>
        </>
      )}
    </div>
  );
};

function renderFields(role, formData, isEditing, handleChange) {
  const fields = [
    { key: "fullname", label: "Nama Lengkap", type: "text" },
    { key: "phone_number", label: "No. Telepon", type: "number" },

    { key: "age", label: "Umur", type: "number" },
    { key: "address", label: "Alamat", type: "textarea" },

    ...(role === "caretaker" //
      ? [
          //
          {
            //
            key: "partner_name", //
            label: "Nama Kerabat Yang bisa dihubungi", //
            type: "text", //
          }, //
          { key: "emergency_contact", label: "Nomor Kerabat", type: "number" }, //
        ]
      : []), //

    ...(role === "caregiver"
      ? [
          {
            key: "experience",
            label: "Pengalaman (Tahun)",
            type: "select",
            options: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
          },
        ]
      : []),
  ];

  return fields.map(({ key, label, type, options, disabled }) => (
    <div key={key} className="flex flex-col gap-1">
      <label className="text-base text-muted-foreground">{label}</label>
      {isEditing ? (
        type === "select" ? (
          <Select
            name={key}
            value={formData[key] || ""}
            onValueChange={(value) =>
              handleChange({ target: { name: key, value } })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Pilih ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === "textarea" ? (
          <textarea
            className="border shadow-xs rounded-sm"
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
          />
        ) : (
          <Input
            type={type}
            name={key}
            value={formData[key] || ""}
            disabled={disabled}
            onChange={handleChange}
          />
        )
      ) : (
        <p className="font-medium">
          {key === "age" && typeof formData.age === "number"
            ? `${formData.age} tahun`
            : formData[key] || "-"}
        </p>
      )}
    </div>
  ));
}

export default EditableProfileCard;
