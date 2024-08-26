"use client";
import { ListFilter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePeople } from "@/hooks/swr";
import { Button } from "@/components/ui/button";
import { PlusCircle, PenBoxIcon } from "lucide-react";
import ActionBar from "@/components/common/actionBar";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { People } from "@/interfaces/peopleDto";
import { PeopleForm } from "@/components/common/peopleForm";


export default function PeopleDashboard() {
  let peopleResponse = usePeople();
  let [people, setPeople] = useState<People>();
  let [dialogOpen, setDialogOpen] = useState(false);
  const createPeople = () => {
    setPeople(undefined);
    setDialogOpen(true);
  }
  const editPeople = (people: People) => {
    setPeople(people);
    setDialogOpen(true);
  }
  const dialogCloseEvent = () => {
    setDialogOpen(false);
    setPeople(undefined);
  }
  return (
    <>
      <ActionBar>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="h-7 gap-1" onClick={() => createPeople()}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              New
            </span>
          </Button>
        </div>
      </ActionBar>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        {peopleResponse.people?.map((element) => (
          <Card key={"account-" + element.id} x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            </CardHeader>
            <CardContent className="flex justify-between">
              <div
                className={"text-3xl font-bold "}
              >
                {element.name}
              </div>
              <div>
                <PenBoxIcon
                  onClick={() => editPeople(element)}
                  className="h-6 w-6 text-foreground cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {dialogOpen && <PeopleForm onEmit={dialogCloseEvent} people={people}></PeopleForm>}
    </>
  );
}
