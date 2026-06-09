-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "referenceNo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "debitAccount" TEXT NOT NULL,
    "creditAccount" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departmentName" TEXT NOT NULL,
    "allocated" REAL NOT NULL,
    "spent" REAL NOT NULL,
    "variance" REAL NOT NULL,
    "period" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TaxRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "referenceNo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WorkflowInstance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "module" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "currentStep" TEXT NOT NULL,
    "assignedRole" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "slaHours" INTEGER NOT NULL DEFAULT 24,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkflowLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowInstanceId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "performedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkflowLog_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "WorkflowInstance" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_code_key" ON "JournalEntry"("code");
