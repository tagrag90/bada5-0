"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  docsInfo,
  gettingStarted,
  studioGuide,
  features,
  faq,
  communityGuidelines,
  teamBadaServices,
  experimentalFeatures,
  officialChannel,
  ssoIntegration,
  projectStructure,
  nodeSystem,
  sdkCustomNodes
} from "./docs-data";
import LatestYoutubeVideo from "@/components/LatestYoutubeVideo";
import YoutubeStats from "@/components/YoutubeStats";
import { useSidebar } from "@/components/layout/SidebarContext";
import DocsNavSidebar from "@/components/layout/DocsNavSidebar";

export default function DocsPage() {
  const { setSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('docs');
    
    return () => {
      setSidebar('none');
    };
  }, [setSidebar]);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">뒤로 가기</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">📚 Documentation</h1>
          <p className="text-muted-foreground mt-2">
            {docsInfo.serviceName} 사용 가이드 | 마지막 업데이트: {docsInfo.lastUpdated}
          </p>
        </div>
      </div>

      {/* 목차 */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 mb-8 border border-primary/20">
        <h2 className="text-lg font-semibold mb-4">
          목차
        </h2>
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <a href="#getting-started" className="text-primary hover:underline">1. 시작하기</a>
          <a href="#studio" className="text-primary hover:underline">2. 스튜디오 가이드</a>
          <a href="#features" className="text-primary hover:underline">3. 주요 기능</a>
          <a href="#services" className="text-primary hover:underline">4. Team Bada 서비스</a>
          <a href="#experimental" className="text-primary hover:underline">5. 실험실 (베타 기능)</a>
          <a href="#channel" className="text-primary hover:underline">6. 공식 채널</a>
          <a href="#faq" className="text-primary hover:underline">7. 자주 묻는 질문</a>
          <a href="#guidelines" className="text-primary hover:underline">8. 커뮤니티 가이드라인</a>
          <a href="#project-structure" className="text-primary hover:underline">9. 프로젝트 구조</a>
          <a href="#nodes" className="text-primary hover:underline">10. 워크스페이스 노드</a>
          <a href="#sdk-nodes" className="text-primary hover:underline">11. SDK 커스텀 노드</a>
          <a href="#sso" className="text-primary hover:underline">12. Login with Divetobada</a>
        </nav>
      </div>

      {/* 환영 메시지 */}
      <section className="mb-12">
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Welcome to Divetobada!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            크리에이터와 팬을 직접 연결하는 새로운 엔터테인먼트 플랫폼입니다. 
            소속사 없이도 주도권을 가지고 활동하며 팬들과 매끄럽게 소통하세요.
          </p>
        </div>
      </section>

      {/* 1. 시작하기 */}
      <section id="getting-started" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. 시작하기</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {gettingStarted.map((item, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <ol className="space-y-2">
                {item.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-sm flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                      {stepIndex + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 스튜디오 가이드 */}
      <section id="studio" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. 스튜디오 가이드</h2>

        {/* 스튜디오란? */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{studioGuide.whatIsStudio.title}</h3>
          <p className="text-muted-foreground mb-4">{studioGuide.whatIsStudio.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {studioGuide.whatIsStudio.features.map((feature, index) => (
              <div key={index} className="bg-white/50 dark:bg-black/20 rounded-lg p-3 text-center text-sm">
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* 스튜디오 만들기 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">{studioGuide.howToCreate.title}</h3>
            <ol className="space-y-3">
              {studioGuide.howToCreate.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">{studioGuide.posting.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{studioGuide.posting.description}</p>
            <ul className="space-y-2">
              {studioGuide.posting.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. 주요 기능 */}
      <section id="features" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. 주요 기능</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-primary">💡 팁:</p>
                <ul className="space-y-1">
                  {feature.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-muted-foreground pl-4">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Team Bada 서비스 */}
      <section id="services" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. Team Bada 서비스</h2>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <p className="text-muted-foreground mb-6">
            Divetobada를 중심으로 한 다양한 서비스들을 하나의 계정으로 이용하세요
          </p>
          
          <div className="grid gap-4">
            {teamBadaServices.map((service) => (
              <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border bg-white dark:bg-gray-900 p-5 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      {service.badge && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 실험실 (베타 기능) */}
      <section id="experimental" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">5. 실험실 (베타 기능)</h2>
        
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm">
            ⚠️ 베타 기능들을 미리 체험해보세요. 피드백은 언제나 환영합니다!
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {experimentalFeatures.map((feature) => (
            <Link
              key={feature.name}
              href={feature.url}
              className="block p-5 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{feature.name}</h4>
                <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-2 py-1 rounded">
                  {feature.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. 공식 채널 */}
      <section id="channel" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">6. 공식 채널</h2>
        
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">{officialChannel.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{officialChannel.description}</p>
          </div>
          
          <LatestYoutubeVideo channelId={officialChannel.channelId} />
          <YoutubeStats channelId={officialChannel.channelId} />
        </div>
      </section>

      {/* 7. 자주 묻는 질문 */}
      <section id="faq" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">7. 자주 묻는 질문 (FAQ)</h2>
        <div className="space-y-4">
          {faq.map((item, index) => (
            <details key={index} className="bg-card border border-border rounded-lg p-6 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                <span className="flex items-start gap-3">
                  <span className="text-primary">Q.</span>
                  {item.question}
                </span>
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-muted-foreground flex items-start gap-3">
                  <span className="text-primary font-semibold">A.</span>
                  <span>{item.answer}</span>
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 8. 커뮤니티 가이드라인 */}
      <section id="guidelines" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">8. 커뮤니티 가이드라인</h2>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-6">
          <p className="text-sm">
            ⚠️ <strong>중요:</strong> 모든 사용자가 안전하고 즐거운 경험을 할 수 있도록 
            아래 가이드라인을 준수해 주세요. 위반 시 계정이 제한될 수 있습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {communityGuidelines.map((section, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 9. 프로젝트 구조 */}
      <section id="project-structure" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">9. 프로젝트 구조</h2>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{projectStructure.title}</h3>
          <p className="text-muted-foreground mb-6">{projectStructure.description}</p>
          
          {/* 레이아웃 구조 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{projectStructure.layout.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{projectStructure.layout.description}</p>
            
            <div className="space-y-4">
              {projectStructure.layout.components.map((component, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-base">{component.name}</h5>
                      <p className="text-sm text-muted-foreground">{component.description}</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {component.width}
                    </span>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {component.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CSS 변수 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">CSS 변수</h4>
            <div className="space-y-3">
              {projectStructure.layout.cssVariables.map((variable, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <code className="text-sm font-mono text-primary">{variable.name}</code>
                  <p className="text-sm text-muted-foreground mt-1">{variable.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">기본값: {variable.default}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 사이드바 타입 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-4">사이드바 타입</h4>
            <div className="space-y-3">
              {projectStructure.sidebarTypes.map((sidebar, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <code className="text-sm font-mono text-primary">{sidebar.type}</code>
                    <span className="text-xs bg-accent px-2 py-1 rounded">{sidebar.width}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{sidebar.description}</p>
                  {sidebar.content && (
                    <p className="text-xs text-muted-foreground mt-1">콘텐츠: {sidebar.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. 워크스페이스 노드 시스템 */}
      <section id="nodes" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">10. 워크스페이스 노드 시스템</h2>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{nodeSystem.title}</h3>
          <p className="text-muted-foreground mb-6">{nodeSystem.description}</p>
          
          {/* 노드 예제 링크 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              실제 노드 컴포넌트의 동작을 확인하고 싶으시다면 노드 예제 페이지를 방문하세요.
            </p>
            <Link href="/docs-old/node-examples">
              <Button variant="outline" className="w-full">
                노드 예제 보기 →
              </Button>
            </Link>
          </div>
          
          {/* 개요 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{nodeSystem.overview.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{nodeSystem.overview.description}</p>
            <ul className="space-y-2">
              {nodeSystem.overview.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 노드 타입 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">노드 타입</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {nodeSystem.nodeTypes.map((nodeType, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{nodeType.icon}</span>
                    <h5 className="font-semibold">{nodeType.label}</h5>
                    <code className="text-xs bg-accent px-2 py-0.5 rounded">{nodeType.type}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{nodeType.description}</p>
                  <ul className="space-y-1">
                    {nodeType.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 노드 작업 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-4">노드 작업</h4>
            <div className="space-y-4">
              {nodeSystem.nodeOperations.map((operation, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">{operation.operation}</h5>
                  <p className="text-sm text-muted-foreground mb-3">{operation.description}</p>
                  <ol className="space-y-2">
                    {operation.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm flex items-start gap-3">
                        <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                          {stepIndex + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. SDK 커스텀 노드 */}
      <section id="sdk-nodes" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">11. SDK 커스텀 노드</h2>
        
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{sdkCustomNodes.title}</h3>
          <p className="text-muted-foreground mb-6">{sdkCustomNodes.description}</p>
          
          {/* 개요 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{sdkCustomNodes.overview.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{sdkCustomNodes.overview.description}</p>
            <ul className="space-y-2">
              {sdkCustomNodes.overview.benefits.map((benefit, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 시작하기 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{sdkCustomNodes.gettingStarted.title}</h4>
            <div className="space-y-4">
              {sdkCustomNodes.gettingStarted.steps.map((step, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">{step.step}. {step.title}</h5>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto mt-3">
                    <pre className="text-xs">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 노드 인터페이스 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{sdkCustomNodes.nodeInterface.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{sdkCustomNodes.nodeInterface.description}</p>
            
            <div className="space-y-3 mb-4">
              <h5 className="font-semibold text-sm">Props</h5>
              {sdkCustomNodes.nodeInterface.props.map((prop, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono text-primary">{prop.name}</code>
                    <code className="text-xs bg-accent px-2 py-0.5 rounded">{prop.type}</code>
                    {prop.required && (
                      <span className="text-xs text-red-500">필수</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{prop.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">Methods</h5>
              {sdkCustomNodes.nodeInterface.methods.map((method, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <code className="text-sm font-mono text-primary">{method.name}</code>
                  <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    파라미터: {method.parameters.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 예제 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">예제</h4>
            <div className="space-y-4">
              {sdkCustomNodes.examples.map((example, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">{example.title}</h5>
                  <p className="text-sm text-muted-foreground mb-3">{example.description}</p>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 모범 사례 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">모범 사례</h4>
            <ul className="space-y-2">
              {sdkCustomNodes.bestPractices.map((practice, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 향후 기능 */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-4">향후 기능</h4>
            <ul className="space-y-2">
              {sdkCustomNodes.futureFeatures.map((feature, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">🚀</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 12. Login with Divetobada (SSO 통합) */}
      <section id="sso" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">12. Login with Divetobada (SSO)</h2>
        
        {/* 소개 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{ssoIntegration.title}</h3>
          <p className="text-muted-foreground mb-6">{ssoIntegration.description}</p>
          
          {/* 주요 장점 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ssoIntegration.benefits.map((benefit, index) => (
              <div key={index} className="bg-white/50 dark:bg-black/20 rounded-lg p-3 text-sm">
                ✓ {benefit}
              </div>
            ))}
          </div>

          {/* 작동 방식 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3">🔄 작동 방식</h4>
            <ol className="space-y-2">
              {ssoIntegration.howItWorks.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 실제 버튼 미리보기 */}
          <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-primary/30 rounded-lg p-6">
            <p className="text-sm font-semibold mb-3 text-center text-muted-foreground">
              👇 실제 버튼 미리보기 (클릭 비활성화)
            </p>
            <div className="flex justify-center relative">
              <iframe 
                src="/api/widget/login-button?redirect=https://vessel.today/sso&service=demo"
                width="320" 
                height="70"
                style={{ border: 'none', pointerEvents: 'none' }}
                title="Login with Divetobada Button Preview"
              />
              <div className="absolute inset-0 cursor-not-allowed" title="미리보기 전용"></div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              💡 검정 배경 + Divetobada 로고 버튼
            </p>
          </div>
        </div>

        {/* 구현 가이드 */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">📚 구현 가이드</h3>

          {/* Step 1 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-3">{ssoIntegration.implementation.step1.title}</h4>
            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
                <code>{ssoIntegration.implementation.step1.code}</code>
              </pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-3">{ssoIntegration.implementation.step2.title}</h4>
            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
                <code>{ssoIntegration.implementation.step2.code}</code>
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-3">{ssoIntegration.implementation.step3.title}</h4>
            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
                <code>{ssoIntegration.implementation.step3.code}</code>
              </pre>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-3">⚠️ 중요 사항</h4>
            <ul className="space-y-2">
              {ssoIntegration.notes.map((note, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 성공 사례 */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-2">✅ 성공 사례</h4>
            <p className="text-sm text-muted-foreground">
              {ssoIntegration.example}
            </p>
          </div>
        </div>
      </section>

      {/* 하단 정보 */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">더 궁금한 점이 있으신가요?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            이메일로 문의해 주시면 빠르게 답변 드리겠습니다.
          </p>
          <a 
            href="mailto:teambada1206@gmail.com"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            📧 문의하기
          </a>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>{docsInfo.serviceName} Documentation | 버전 {docsInfo.version}</p>
          <p className="mt-1">마지막 업데이트: {docsInfo.lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}

