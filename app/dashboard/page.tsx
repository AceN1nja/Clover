"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FileText, FolderDot, FolderKey, History, Moon, Sun, Upload, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import type { FilePondFile } from "filepond";
import { toast } from "sonner";
import { parsePDF } from "./actions";
import PdfParse from "pdf-parse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeSummaryI } from "./actions";
import { Badge } from "@/components/ui/badge";

const ResumeCard = ({ file }: { file: ResumeSummaryI }) => (
  <Card className="w-full mb-4">
    <CardHeader>
      <CardTitle className="flex items-center">
        <FileText className="mr-2" />
        {file.title || "Untitled Resume"}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {file.keywords.map((keyword, index) => (
        <Badge key={index} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full mr-2">
          {keyword}
        </Badge>
      ))}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { setTheme, theme } = useTheme();
  const [files, setFiles] = useState<ResumeSummaryI[]>([]);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    if (files.length + acceptedFiles.length > 3) {
      toast.error('You can only upload 3 resumes.');
      return;
    }

    for (const file of acceptedFiles) {
      if (files.length >= 3) break;
      console.log("Parsing file...", file);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const result = await parsePDF(formData);
        setFiles(prev => [...prev, result]);
        toast.success('Resume parsed successfully.');
      } catch (error) {
        console.error('Error parsing file:', error);
        toast.error('Error parsing file, please try again later.');
      }
    }
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    maxFiles: 3,
  });

  return (
    <main className="relative w-dvw h-dvh flex flex-row items-center justify-start">
      <TooltipProvider delayDuration={300}>
        <Dock direction="middle" className="absolute inset-x-0 bottom-[5%]">
          <DockIcon>

            <Tooltip>
              <TooltipTrigger className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-12 rounded-full",
              )}>
                <User />
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>
                Your Profile & Settings
              </TooltipContent>
            </Tooltip>


          </DockIcon>

          <Separator orientation="vertical" />
          <DockIcon>
            <Dialog>
              <Tooltip>
                <DialogTrigger asChild>

                  <TooltipTrigger className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full",
                  )}>
                    <FolderKey />
                  </TooltipTrigger>

                </DialogTrigger>
                <TooltipContent sideOffset={10}>
                  Resumes
                </TooltipContent>
              </Tooltip>

              <DialogContent className="max-w-full w-1/2">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex flex-row items-center justify-between pr-4">Resumes <div {...getRootProps()} className="inline-block">
                    <input {...getInputProps()} />
                    <Button
                      variant="default"
                      className={`rounded-full`}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isDragActive ? 'Drop the file here' : 'Upload Resume'}
                    </Button>
                  </div></DialogTitle>
                  {/* <DialogDescription>
                    You can upload and manage your resumes here. <br /><br />
                    Ideally, you would have a resume for each domain you would want to apply for.<br />
                    For example, Resume_Hospitatlity.pdf, Resume_Tech.pdf, etc.<br />
                    <br />
                    You can upload 3 resumes max.
                  </DialogDescription> */}

                </DialogHeader>
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                  {files.map((file, index) => (
                    <ResumeCard key={index} file={file} />
                  ))}
                </div>

              </DialogContent>
            </Dialog>
          </DockIcon>

          <DockIcon>
            <Dialog>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full",
                  )}>
                    <FolderDot />
                  </TooltipTrigger>
                  <TooltipContent sideOffset={10}>
                    Supporting files
                  </TooltipContent>
                </Tooltip >

              </DialogTrigger>
              <DialogContent>
                <h1>Dialog Content</h1>
              </DialogContent>
            </Dialog>
          </DockIcon>

          <DockIcon>
            <Dialog>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full",
                  )}>
                    <History />
                  </TooltipTrigger>
                  <TooltipContent sideOffset={10}>
                    Your History
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent>

              </DialogContent>
            </Dialog>
          </DockIcon>

          <Separator orientation="vertical" />

          <DockIcon>
            <Tooltip>
              <TooltipTrigger className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-12 rounded-full",
              )}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>
                Light Mode
              </TooltipContent>
            </Tooltip>
          </DockIcon>


        </Dock>
      </TooltipProvider>

    </main>
  )
}
