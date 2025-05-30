
"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExamResultItem {
  parameter: string;
  value: string;
  reference: string;
}

export interface MockExamResult {
  examName: string;
  examDate: string;
  results: ExamResultItem[];
  observations?: string;
}

interface ViewExamResultDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  examResult: MockExamResult;
}

export default function ViewExamResultDialog({
  isOpen,
  onOpenChange,
  examResult,
}: ViewExamResultDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Resultado do Exame: {examResult.examName}</DialogTitle>
          <DialogDescription>
            Data do Exame: {examResult.examDate}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Referência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examResult.results.map((item) => (
                <TableRow key={item.parameter}>
                  <TableCell className="font-medium">{item.parameter}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{item.reference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {examResult.observations && (
            <div className="mt-4 p-3 border rounded-md bg-secondary/50">
              <h4 className="font-semibold mb-1">Observações:</h4>
              <p className="text-sm text-foreground/80">{examResult.observations}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
