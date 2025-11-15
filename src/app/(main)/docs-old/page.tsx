"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  docsInfo,
  projectOverview,
  gettingStarted,
  architectureGuide,
  authenticationGuide,
  socialFeatures,
  studioSystem,
  workspaceNodeSystem,
  apiReference,
  sdkGuide,
  betaFeatures,
  faq,
  communityGuidelines,
  teamBadaServices,
  officialChannel
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
    <div className="max-w-5xl mx-auto px-4 py-8">
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
            {docsInfo.serviceName} 개발자 가이드 | 버전 {docsInfo.version} | 마지막 업데이트: {docsInfo.lastUpdated}
          </p>
        </div>
      </div>

      {/* 목차 */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 mb-8 border border-primary/20">
        <h2 className="text-lg font-semibold mb-4">목차</h2>
        <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <a href="#overview" className="text-primary hover:underline">1. 프로젝트 개요</a>
          <a href="#getting-started" className="text-primary hover:underline">2. 시작하기</a>
          <a href="#architecture" className="text-primary hover:underline">3. 아키텍처 가이드</a>
          <a href="#authentication" className="text-primary hover:underline">4. 인증 시스템</a>
          <a href="#social" className="text-primary hover:underline">5. 소셜 기능</a>
          <a href="#studio" className="text-primary hover:underline">6. 스튜디오 시스템</a>
          <a href="#workspace" className="text-primary hover:underline">7. 워크스페이스</a>
          <a href="#api" className="text-primary hover:underline">8. API 레퍼런스</a>
          <a href="#sdk" className="text-primary hover:underline">9. SDK 가이드</a>
          <a href="#beta" className="text-primary hover:underline">10. 베타 기능</a>
          <a href="#faq" className="text-primary hover:underline">11. FAQ</a>
          <a href="#guidelines" className="text-primary hover:underline">12. 커뮤니티 가이드라인</a>
        </nav>
      </div>

      {/* 환영 메시지 */}
      <section className="mb-12">
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Welcome to Divetobada!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {projectOverview.description}
          </p>
        </div>
      </section>

      {/* 1. 프로젝트 개요 */}
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. 프로젝트 개요</h2>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{projectOverview.vision.title}</h3>
          <p className="text-muted-foreground mb-4">{projectOverview.vision.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {projectOverview.vision.values.map((value, index) => (
              <div key={index} className="bg-white/50 dark:bg-black/20 rounded-lg p-3 text-center text-sm">
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* 기술 스택 */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">{projectOverview.techStack.title}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-primary">프론트엔드</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {projectOverview.techStack.frontend.map((tech, index) => (
                    <div key={index} className="border border-border rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{tech.name}</span>
                        {tech.version && (
                          <code className="text-xs bg-accent px-2 py-0.5 rounded">{tech.version}</code>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 text-primary">백엔드</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {projectOverview.techStack.backend.map((tech, index) => (
                    <div key={index} className="border border-border rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{tech.name}</span>
                        {tech.version && (
                          <code className="text-xs bg-accent px-2 py-0.5 rounded">{tech.version}</code>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 text-primary">인프라</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {projectOverview.techStack.infrastructure.map((tech, index) => (
                    <div key={index} className="border border-border rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{tech.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 시작하기 */}
      <section id="getting-started" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. 시작하기</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {gettingStarted.steps.map((step, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              {step.alternative && (
                <p className="text-xs text-primary mb-3">💡 {step.alternative}</p>
              )}
              <ol className="space-y-2">
                {step.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                      {itemIndex + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 아키텍처 가이드 */}
      <section id="architecture" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. 아키텍처 가이드</h2>
        
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{architectureGuide.layout.title}</h3>
          <p className="text-muted-foreground mb-6">{architectureGuide.layout.description}</p>
          
          {/* 레이아웃 구조 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">레이아웃 컴포넌트</h4>
            <div className="space-y-4">
              {Object.entries(architectureGuide.layout.structure).map(([key, component]: [string, any]) => (
                <div key={key} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-base">{component.name}</h5>
                      <p className="text-sm text-muted-foreground">{component.width}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {component.components?.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {component.features?.map((feature: string, featureIndex: number) => (
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
              {architectureGuide.layout.cssVariables.map((variable, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <code className="text-sm font-mono text-primary">{variable.name}</code>
                  <p className="text-sm text-muted-foreground mt-1">{variable.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    가능한 값: {variable.values.join(", ")} | 기본값: {variable.default}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 사이드바 타입 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{architectureGuide.sidebar.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{architectureGuide.sidebar.description}</p>
            <div className="space-y-3">
              {architectureGuide.sidebar.types.map((sidebar, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <code className="text-sm font-mono text-primary">{sidebar.type}</code>
                    <span className="text-xs bg-accent px-2 py-1 rounded">{sidebar.width}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{sidebar.description}</p>
                  {sidebar.content && (
                    <p className="text-xs text-muted-foreground mt-1">콘텐츠: {sidebar.content}</p>
                  )}
                  {sidebar.useCase && (
                    <p className="text-xs text-muted-foreground mt-1">사용 사례: {sidebar.useCase}</p>
                  )}
                  {sidebar.dynamic && (
                    <p className="text-xs text-primary mt-1">💡 {sidebar.dynamic}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 라우팅 구조 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-4">{architectureGuide.routing.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{architectureGuide.routing.description}</p>
            <div className="space-y-3">
              {architectureGuide.routing.structure.map((route, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <code className="text-sm font-mono text-primary">{route.path}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{route.description}</p>
                  {route.components && (
                    <div className="text-xs text-muted-foreground">
                      컴포넌트: {route.components.join(", ")}
                    </div>
                  )}
                  {route.tabs && (
                    <div className="text-xs text-muted-foreground mt-1">
                      탭: {route.tabs.join(", ")}
                    </div>
                  )}
                  {route.sidebar && (
                    <div className="text-xs text-muted-foreground mt-1">
                      사이드바: {route.sidebar}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 인증 시스템 */}
      <section id="authentication" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. 인증 시스템</h2>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{authenticationGuide.title}</h3>
          <p className="text-muted-foreground mb-6">{authenticationGuide.description}</p>
          
          {/* 인증 방법 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">인증 방법</h4>
            <div className="space-y-4">
              {authenticationGuide.methods.map((method, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-base">{method.name}</h5>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <code className="text-xs bg-accent px-2 py-1 rounded">{method.endpoint}</code>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {method.features.map((feature, featureIndex) => (
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

          {/* 세션 관리 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{authenticationGuide.session.description}</h4>
            <ul className="space-y-2">
              {authenticationGuide.session.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SSO 통합 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-4">{authenticationGuide.sso.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{authenticationGuide.sso.description}</p>
            
            <div className="space-y-2 mb-4">
              {authenticationGuide.sso.benefits.map((benefit, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3 text-sm">
                  ✓ {benefit}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {Object.entries(authenticationGuide.sso.implementation).map(([key, step]: [string, any]) => (
                <div key={key} className="border border-border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">{step.title}</h5>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto mt-3">
                    <pre className="text-xs">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
              <h5 className="font-semibold text-sm mb-2">⚠️ 중요 사항</h5>
              <ul className="space-y-1">
                {authenticationGuide.sso.notes.map((note, index) => (
                  <li key={index} className="text-xs flex items-start gap-2">
                    <span className="flex-shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 소셜 기능 */}
      <section id="social" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">5. 소셜 기능</h2>
        
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{socialFeatures.title}</h3>
          <p className="text-muted-foreground mb-6">{socialFeatures.description}</p>
          
          {/* 게시물 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{socialFeatures.posts.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{socialFeatures.posts.description}</p>
            <ul className="space-y-2 mb-4">
              {socialFeatures.posts.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4">
              <h5 className="font-semibold text-sm mb-2">API 엔드포인트</h5>
              <div className="space-y-2">
                {Object.entries(socialFeatures.posts.api).map(([method, endpoint]: [string, string]) => (
                  <div key={method} className="flex items-center gap-2">
                    <code className="text-xs bg-accent px-2 py-0.5 rounded">{method}</code>
                    <code className="text-xs font-mono">{endpoint}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 댓글 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{socialFeatures.comments.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{socialFeatures.comments.description}</p>
            <ul className="space-y-2 mb-4">
              {socialFeatures.comments.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4">
              <h5 className="font-semibold text-sm mb-2">API 엔드포인트</h5>
              <div className="space-y-2">
                {Object.entries(socialFeatures.comments.api).map(([method, endpoint]: [string, string]) => (
                  <div key={method} className="flex items-center gap-2">
                    <code className="text-xs bg-accent px-2 py-0.5 rounded">{method}</code>
                    <code className="text-xs font-mono">{endpoint}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 상호작용 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{socialFeatures.interactions.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{socialFeatures.interactions.description}</p>
            <ul className="space-y-2 mb-4">
              {socialFeatures.interactions.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4">
              <h5 className="font-semibold text-sm mb-2">API 엔드포인트</h5>
              <div className="space-y-2">
                {Object.entries(socialFeatures.interactions.api).map(([method, endpoint]: [string, string]) => (
                  <div key={method} className="flex items-center gap-2">
                    <code className="text-xs bg-accent px-2 py-0.5 rounded">{method}</code>
                    <code className="text-xs font-mono">{endpoint}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 피드 시스템 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-4">{socialFeatures.feed.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{socialFeatures.feed.description}</p>
            <div className="space-y-3">
              {socialFeatures.feed.types.map((feed, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-semibold text-sm">{feed.name}</h5>
                    {feed.requiresAuth && (
                      <span className="text-xs bg-accent px-2 py-0.5 rounded">인증 필요</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{feed.description}</p>
                  <code className="text-xs font-mono">{feed.endpoint}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. 스튜디오 시스템 */}
      <section id="studio" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">6. 스튜디오 시스템</h2>
        
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{studioSystem.overview.title}</h3>
          <p className="text-muted-foreground mb-4">{studioSystem.overview.description}</p>
          <ul className="space-y-2">
            {studioSystem.overview.features.map((feature, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 스튜디오 생성 */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">{studioSystem.creation.title}</h3>
          <ol className="space-y-3 mb-4">
            {studioSystem.creation.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-sm pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <div className="border-t border-border pt-4">
            <code className="text-xs font-mono">{studioSystem.creation.api}</code>
          </div>
        </div>

        {/* 스튜디오 관리 */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">{studioSystem.management.title}</h3>
          <ul className="space-y-2 mb-4">
            {studioSystem.management.features.map((feature, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-4">
            <h5 className="font-semibold text-sm mb-2">API 엔드포인트</h5>
            <div className="space-y-2">
              {Object.entries(studioSystem.management.api).map(([key, endpoint]: [string, string]) => (
                <div key={key} className="flex items-center gap-2">
                  <code className="text-xs bg-accent px-2 py-0.5 rounded">{key}</code>
                  <code className="text-xs font-mono">{endpoint}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 스튜디오 채널 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">{studioSystem.channels.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{studioSystem.channels.description}</p>
          <div className="space-y-3">
            {studioSystem.channels.types.map((channel, index) => (
              <div key={index} className="border border-border rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-semibold text-sm">{channel.name}</h5>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{channel.description}</p>
                <code className="text-xs font-mono">{channel.path}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 워크스페이스 노드 시스템 */}
      <section id="workspace" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">7. 워크스페이스 노드 시스템</h2>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{workspaceNodeSystem.title}</h3>
          <p className="text-muted-foreground mb-6">{workspaceNodeSystem.description}</p>
          
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
            <h4 className="font-semibold text-lg mb-4">{workspaceNodeSystem.overview.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{workspaceNodeSystem.overview.description}</p>
            <ul className="space-y-2">
              {workspaceNodeSystem.overview.features.map((feature, index) => (
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
              {workspaceNodeSystem.nodeTypes.map((nodeType, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{nodeType.icon}</span>
                    <h5 className="font-semibold">{nodeType.label}</h5>
                    <code className="text-xs bg-accent px-2 py-0.5 rounded">{nodeType.type}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{nodeType.description}</p>
                  {nodeType.useCase && (
                    <p className="text-xs text-primary mb-2">💡 사용 사례: {nodeType.useCase}</p>
                  )}
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
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">노드 작업</h4>
            <div className="space-y-4">
              {workspaceNodeSystem.operations.map((operation, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold">{operation.operation}</h5>
                    <code className="text-xs bg-accent px-2 py-0.5 rounded">{operation.api}</code>
                  </div>
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

          {/* 파일 시스템 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-4">{workspaceNodeSystem.files.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{workspaceNodeSystem.files.description}</p>
            <ul className="space-y-2 mb-4">
              {workspaceNodeSystem.files.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4">
              <h5 className="font-semibold text-sm mb-2">API 엔드포인트</h5>
              <div className="space-y-2">
                {Object.entries(workspaceNodeSystem.files.api).map(([key, endpoint]: [string, string]) => (
                  <div key={key} className="flex items-center gap-2">
                    <code className="text-xs bg-accent px-2 py-0.5 rounded">{key}</code>
                    <code className="text-xs font-mono">{endpoint}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. API 레퍼런스 */}
      <section id="api" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">8. API 레퍼런스</h2>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{apiReference.title}</h3>
          <p className="text-muted-foreground mb-4">{apiReference.description}</p>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-6">
            <p className="text-sm font-mono text-primary mb-2">Base URL: {apiReference.baseUrl}</p>
            <p className="text-sm text-muted-foreground">{apiReference.authentication.description}</p>
          </div>

          {/* 엔드포인트 그룹 */}
          <div className="space-y-6">
            {Object.entries(apiReference.endpoints).map(([group, endpoints]: [string, any]) => (
              <div key={group} className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <h4 className="font-semibold text-lg mb-4 capitalize">{group}</h4>
                <div className="space-y-4">
                  {endpoints.map((endpoint: any, index: number) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded font-semibold">
                          {endpoint.method}
                        </code>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        {endpoint.auth && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">인증 필요</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                      {endpoint.params && (
                        <div className="text-xs text-muted-foreground mb-2">
                          파라미터: {endpoint.params.join(", ")}
                        </div>
                      )}
                      {endpoint.body && (
                        <div className="text-xs text-muted-foreground mb-2">
                          Body: {endpoint.body.join(", ")}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        응답: <code className="bg-muted px-1 rounded">{endpoint.response}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SDK 가이드 */}
      <section id="sdk" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">9. SDK 가이드</h2>
        
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-xl mb-3">{sdkGuide.title}</h3>
          <p className="text-muted-foreground mb-6">{sdkGuide.description}</p>
          
          {/* 상태 알림 */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <p className="text-sm">
              ⚠️ <strong>현재 상태:</strong> {sdkGuide.overview.status}
            </p>
          </div>
          
          {/* 개요 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{sdkGuide.overview.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{sdkGuide.overview.description}</p>
            <ul className="space-y-2">
              {sdkGuide.overview.benefits.map((benefit, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 시작하기 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">{sdkGuide.gettingStarted.title}</h4>
            <div className="space-y-4">
              {sdkGuide.gettingStarted.steps.map((step, index) => (
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
            <h4 className="font-semibold text-lg mb-4">{sdkGuide.interface.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{sdkGuide.interface.description}</p>
            
            <div className="space-y-3 mb-4">
              <h5 className="font-semibold text-sm">Props</h5>
              {sdkGuide.interface.props.map((prop, index) => (
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
              {sdkGuide.interface.methods.map((method, index) => (
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
              {sdkGuide.examples.map((example, index) => (
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
              {sdkGuide.bestPractices.map((practice, index) => (
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
              {sdkGuide.futureFeatures.map((feature, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">🚀</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 10. 베타 기능 */}
      <section id="beta" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">10. 베타 기능</h2>
        
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm">
            ⚠️ <strong>주의:</strong> {betaFeatures.warning}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {betaFeatures.features.map((feature) => (
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
              <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
              <ul className="space-y-1">
                {feature.features.map((feat, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">11. 자주 묻는 질문 (FAQ)</h2>
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

      {/* 12. 커뮤니티 가이드라인 */}
      <section id="guidelines" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">12. 커뮤니티 가이드라인</h2>
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

      {/* 13. Team Bada 서비스 */}
      <section id="services" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">13. Team Bada 서비스</h2>
        
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

      {/* 14. 공식 채널 */}
      <section id="channel" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">14. 공식 채널</h2>
        
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">{officialChannel.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{officialChannel.description}</p>
          </div>
          
          <LatestYoutubeVideo channelId={officialChannel.channelId} />
          <YoutubeStats channelId={officialChannel.channelId} />
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

