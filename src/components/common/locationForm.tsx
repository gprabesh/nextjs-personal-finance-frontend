"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import http from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Location } from "@/interfaces/locationDto";

const LocationSchema = z.object({
  name: z.string().min(3)
});

type LocationSchemaType = z.infer<typeof LocationSchema>;

export function LocationForm({
  location,
  onEmit
}: {
  location?: Location;
  onEmit: (shouldClose: boolean) => void;
}) {
  let {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LocationSchemaType>({ resolver: zodResolver(LocationSchema) });

  const onSubmit: SubmitHandler<LocationSchemaType> = (data) => {
    if (location) {
      http
        .patch("/api/locations/" + location.id, data)
        .then((response: AxiosResponse) => {
          console.log(response);
          onEmit(true);
        });
    } else {
      http.post("/api/locations", data).then((response: AxiosResponse) => {
        console.log(response);
        onEmit(true);
      });
    }
  };
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{location ? 'Edit' : 'Add'} Location</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                className="col-span-3"
                required
                defaultValue={location?.name}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{location ? "Update" : "Save"}</Button>
            <Button onClick={() => onEmit(true)}>Close</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
