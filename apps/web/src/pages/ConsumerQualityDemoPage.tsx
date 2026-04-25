import { WorkspaceDemoPage } from "./WorkspaceDemoPage";
import { consumerQualitySeedData } from "../data/cases/consumerQualityCase";

export function ConsumerQualityDemoPage() {
  return <WorkspaceDemoPage seedData={consumerQualitySeedData} demoId="consumer-quality" />;
}
