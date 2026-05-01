"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ScenarioInputs } from "@/lib/simulation/types";
import { DEFAULT_SCENARIO_INPUTS } from "@/lib/simulation/mock-data";
import { Play, RotateCcw } from "lucide-react";

// shadcn / Radix components
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ScenarioInputPanelProps {
  initialValues?: ScenarioInputs;
  onChange?: (values: ScenarioInputs) => void;
  onRun?: (values: ScenarioInputs) => void;
  isRunning?: boolean;
  className?: string;
}

const FORECAST_OPTIONS = [
  { value: "4", label: "4w" },
  { value: "8", label: "8w" },
  { value: "12", label: "12w" },
  { value: "26", label: "26w" },
];

function SliderField({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "%",
  tooltip,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  tooltip?: string;
}) {
  const labelContent = (
    <Label htmlFor={id} className="text-sm text-gray-300">
      {label}
    </Label>
  );

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>{labelContent}</TooltipTrigger>
            <TooltipContent side="top">{tooltip}</TooltipContent>
          </Tooltip>
        ) : (
          labelContent
        )}
        <span className="text-sm font-mono text-white tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="cursor-pointer"
      />
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 99999,
  step = 1,
  prefix = "",
  tooltip,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  tooltip?: string;
}) {
  const labelContent = (
    <Label htmlFor={id} className="text-sm text-gray-300">
      {label}
    </Label>
  );

  return (
    <div className="space-y-2">
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>{labelContent}</TooltipTrigger>
          <TooltipContent side="top">{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        labelContent
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className={cn(
            "font-mono tabular-nums",
            prefix && "pl-7"
          )}
        />
      </div>
    </div>
  );
}

export default function ScenarioInputPanel({
  initialValues,
  onChange,
  onRun,
  isRunning = false,
  className,
}: ScenarioInputPanelProps) {
  const [values, setValues] = useState<ScenarioInputs>(
    initialValues || DEFAULT_SCENARIO_INPUTS
  );

  // Notify parent of changes via useEffect (avoids setState during render)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onChange?.(values);
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback(
    (field: keyof ScenarioInputs, val: number | string) => {
      setValues(prev => ({ ...prev, [field]: val }));
    },
    []
  );

  const reset = () => {
    const defaults = initialValues || DEFAULT_SCENARIO_INPUTS;
    setValues(defaults);
    onChange?.(defaults);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Scenario Name */}
      <div className="space-y-2">
        <Label htmlFor="scenario-name" className="text-sm text-gray-300">
          Scenario Name
        </Label>
        <Input
          id="scenario-name"
          type="text"
          value={values.name}
          onChange={e => update("name", e.target.value)}
          placeholder="Enter scenario name..."
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Core Numbers */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Workforce & Demand
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            id="employees"
            label="Employees"
            value={values.employees}
            onChange={v => update("employees", v)}
            min={1}
            max={500}
            tooltip="Total number of employees in the workforce"
          />
          <NumberField
            id="hourly-cost"
            label="Avg Hourly Cost"
            value={values.avgHourlyCost}
            onChange={v => update("avgHourlyCost", v)}
            min={10}
            max={200}
            prefix="$"
            tooltip="Average cost per employee per hour"
          />
        </div>
        <div className="mt-4">
          <NumberField
            id="weekly-demand"
            label="Weekly Demand (orders)"
            value={values.weeklyDemand}
            onChange={v => update("weeklyDemand", v)}
            min={100}
            max={10000}
            step={50}
            tooltip="Expected number of orders per week"
          />
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Improvement Sliders */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Assumptions
        </h4>
        <div className="space-y-5">
          <SliderField
            id="productivity-gain"
            label="Productivity Gain"
            value={values.productivityGainPct}
            onChange={v => update("productivityGainPct", v)}
            max={50}
            step={0.5}
            tooltip="Expected % improvement in output per employee"
          />
          <SliderField
            id="overtime-reduction"
            label="Overtime Reduction"
            value={values.overtimeReductionPct}
            onChange={v => update("overtimeReductionPct", v)}
            max={100}
            step={1}
            tooltip="Expected % reduction in overtime hours"
          />
          <SliderField
            id="supplier-delay"
            label="Supplier Delay Risk"
            value={values.supplierDelayRiskPct}
            onChange={v => update("supplierDelayRiskPct", v)}
            max={50}
            step={1}
            tooltip="Probability of supply chain delays affecting operations"
          />
          <SliderField
            id="defect-rate"
            label="Error/Defect Rate"
            value={values.errorDefectRatePct}
            onChange={v => update("errorDefectRatePct", v)}
            max={20}
            step={0.5}
            tooltip="Expected % of output that fails quality checks"
          />
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Forecast Period — Radix ToggleGroup */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Forecast Period
        </h4>
        <ToggleGroup
          type="single"
          value={String(values.forecastWeeks)}
          onValueChange={v => {
            if (v) update("forecastWeeks", parseInt(v));
          }}
          variant="outline"
          className="w-full grid grid-cols-4 gap-2"
        >
          {FORECAST_OPTIONS.map(opt => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={() => onRun?.(values)}
          disabled={isRunning}
          className="flex-1 gap-2"
          size="lg"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play size={16} />
              Run Simulation
            </>
          )}
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={reset}
              variant="outline"
              size="lg"
            >
              <RotateCcw size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset to defaults</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
