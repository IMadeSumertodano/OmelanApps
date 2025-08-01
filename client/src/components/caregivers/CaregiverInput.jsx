import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function CaregiverInput({
  name,
  onNameChange,
  email,
  onEmailChange,
  phoneNumber,
  onPhoneNumberChange,
  password,
  onPasswordChange,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input id="name" value={name} onChange={onNameChange} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="emai"
          value={email}
          onChange={onEmailChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">No. Telepon</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          pattern="[0-9+]{10,15}"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={onPasswordChange}
          required
        />
      </div>
    </div>
  );
}
