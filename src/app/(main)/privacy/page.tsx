import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrivacySection from "./components/PrivacySection";
import DataTable from "./components/DataTable";
import ContactCard from "./components/ContactCard";
import { 
  privacyDataItems, 
  thirdPartyServices, 
  contactInfo, 
  remedyOrganizations,
  policyInfo 
} from "./privacy-data";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | Bada",
  description: "Bada 서비스의 개인정보 처리방침을 확인하세요.",
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold">개인정보 처리방침</h1>
          <p className="text-muted-foreground mt-2">
            시행일자: {policyInfo.effectiveDate} | 버전: {policyInfo.version}
          </p>
        </div>
      </div>

      {/* 목차 */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">📋 목차</h2>
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <a href="#intro" className="text-primary hover:underline">1. 서비스 소개</a>
          <a href="#collection" className="text-primary hover:underline">2. 개인정보 수집 항목</a>
          <a href="#purpose" className="text-primary hover:underline">3. 개인정보 이용 목적</a>
          <a href="#retention" className="text-primary hover:underline">4. 개인정보 보유 기간</a>
          <a href="#third-party" className="text-primary hover:underline">5. 제3자 서비스 연동</a>
          <a href="#rights" className="text-primary hover:underline">6. 정보주체의 권리</a>
          <a href="#security" className="text-primary hover:underline">7. 개인정보 보호 조치</a>
          <a href="#contact" className="text-primary hover:underline">8. 개인정보 보호책임자</a>
          <a href="#remedy" className="text-primary hover:underline">9. 권익침해 구제방법</a>
          <a href="#changes" className="text-primary hover:underline">10. 개인정보 처리방침 변경</a>
        </nav>
      </div>

      {/* 1. 서비스 소개 */}
      <PrivacySection title="1. 서비스 소개" icon="🌊">
        <div id="intro">
          <p className="mb-4">
            <strong>{policyInfo.serviceName}</strong>은 K-culture를 사랑하는 모든 사람들을 위한 소셜 커뮤니티 플랫폼입니다. 
            사용자의 개인정보를 안전하게 보호하며, 관련 법령에 따라 투명하게 처리합니다.
          </p>
          <p className="mb-4">
            본 개인정보 처리방침은 <strong>개인정보보호법</strong>, <strong>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong> 
            등 관련 법령을 준수하여 작성되었습니다.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm">
              💡 <strong>알림:</strong> 본 서비스는 만 14세 이상의 사용자를 대상으로 합니다. 
              만 14세 미만의 경우 법정대리인의 동의가 필요합니다.
            </p>
          </div>
        </div>
      </PrivacySection>

      {/* 2. 개인정보 수집 항목 */}
      <PrivacySection title="2. 개인정보 수집 항목" icon="📋">
        <div id="collection">
          <p className="mb-6">
            {policyInfo.serviceName}에서 수집하는 개인정보 항목은 다음과 같습니다:
          </p>
          <DataTable data={privacyDataItems} />
        </div>
      </PrivacySection>

      {/* 3. 개인정보 이용 목적 */}
      <PrivacySection title="3. 개인정보 이용 목적" icon="🎯">
        <div id="purpose">
          <p className="mb-4">수집한 개인정보는 다음의 목적을 위해 이용됩니다:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>서비스 제공:</strong> 회원 관리, 콘텐츠 제공, 커뮤니티 기능 제공</li>
            <li><strong>서비스 개선:</strong> 사용자 경험 개선, 새로운 기능 개발</li>
            <li><strong>안전 관리:</strong> 부정 이용 방지, 보안 사고 대응</li>
            <li><strong>고객 지원:</strong> 문의 응답, 기술 지원, 공지사항 전달</li>
            <li><strong>법적 의무 이행:</strong> 관련 법령에 따른 의무 이행</li>
          </ul>
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm">
              ⚠️ <strong>중요:</strong> 수집 목적 범위를 초과하여 개인정보를 이용하지 않으며, 
              목적이 변경될 경우 사전에 동의를 받습니다.
            </p>
          </div>
        </div>
      </PrivacySection>

      {/* 4. 개인정보 보유 기간 */}
      <PrivacySection title="4. 개인정보 보유 기간" icon="⏰">
        <div id="retention">
          <p className="mb-4">개인정보의 보유 및 이용 기간은 다음과 같습니다:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>회원 정보:</strong> 회원 탈퇴 시까지</li>
            <li><strong>게시물 및 댓글:</strong> 사용자가 직접 삭제하거나 회원 탈퇴 시까지</li>
            <li><strong>시스템 로그:</strong> 회원 탈퇴 후 30일 (보안 목적)</li>
            <li><strong>법령에 따른 보존:</strong> 관련 법령에서 정한 기간</li>
          </ul>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>※ 보유기간 종료 시 해당 개인정보는 지체없이 파기됩니다.</p>
          </div>
        </div>
      </PrivacySection>

      {/* 5. 제3자 서비스 연동 */}
      <PrivacySection title="5. 제3자 서비스 연동" icon="🔗">
        <div id="third-party">
          <p className="mb-6">서비스 제공을 위해 다음의 제3자 서비스와 연동됩니다:</p>
          <div className="grid gap-4">
            {thirdPartyServices.map((service, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg">{service.name}</h4>
                  <a 
                    href={service.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    정책 보기 ↗
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{service.purpose}</p>
                <div className="text-sm">
                  <strong>공유 정보:</strong> {service.dataShared.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PrivacySection>

      {/* 6. 정보주체의 권리 */}
      <PrivacySection title="6. 정보주체의 권리" icon="⚖️">
        <div id="rights">
          <p className="mb-4">사용자는 개인정보에 대해 다음의 권리를 행사할 수 있습니다:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">✅ 열람권</h4>
              <p className="text-sm text-muted-foreground">본인의 개인정보 처리 현황을 확인할 수 있습니다.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">✏️ 정정·삭제권</h4>
              <p className="text-sm text-muted-foreground">개인정보의 수정이나 삭제를 요청할 수 있습니다.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">⏸️ 처리정지권</h4>
              <p className="text-sm text-muted-foreground">개인정보 처리 중단을 요청할 수 있습니다.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">📥 데이터 이동권</h4>
              <p className="text-sm text-muted-foreground">본인의 개인정보를 다운로드할 수 있습니다.</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm">
              💬 <strong>권리 행사 방법:</strong> 서비스 내 설정 페이지 또는 개인정보 보호책임자에게 이메일로 요청하실 수 있습니다.
            </p>
          </div>
        </div>
      </PrivacySection>

      {/* 7. 개인정보 보호 조치 */}
      <PrivacySection title="7. 개인정보 보호 조치" icon="🛡️">
        <div id="security">
          <p className="mb-4">개인정보 보호를 위해 다음의 기술적·관리적 조치를 취하고 있습니다:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">🔧 기술적 조치</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>비밀번호 암호화 (Argon2 해싱)</li>
                <li>HTTPS 통신 암호화</li>
                <li>세션 보안 관리</li>
                <li>파일 업로드 검증</li>
                <li>정기적 보안 업데이트</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">👥 관리적 조치</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>개인정보 보호책임자 지정</li>
                <li>접근 권한 최소화</li>
                <li>정기적 보안 교육</li>
                <li>개인정보 처리 기록 관리</li>
                <li>보안 사고 대응 절차</li>
              </ul>
            </div>
          </div>
        </div>
      </PrivacySection>

      {/* 8. 개인정보 보호책임자 */}
      <PrivacySection title="8. 개인정보 보호책임자" icon="👤">
        <div id="contact">
          <p className="mb-6">개인정보 처리에 관한 문의사항이 있으시면 아래 연락처로 문의해 주세요:</p>
          <ContactCard contact={contactInfo} />
        </div>
      </PrivacySection>

      {/* 9. 권익침해 구제방법 */}
      <PrivacySection title="9. 권익침해 구제방법" icon="🆘">
        <div id="remedy">
          <p className="mb-6">개인정보 침해로 인한 신고나 상담이 필요하신 경우 아래 기관에 문의하실 수 있습니다:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {remedyOrganizations.map((org, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{org.name}</h4>
                <p className="text-sm mb-1">
                  <strong>웹사이트:</strong> 
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    {org.website} ↗
                  </a>
                </p>
                <p className="text-sm">
                  <strong>전화:</strong> {org.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PrivacySection>

      {/* 10. 개인정보 처리방침 변경 */}
      <PrivacySection title="10. 개인정보 처리방침 변경" icon="📝">
        <div id="changes">
          <p className="mb-4">
            본 개인정보 처리방침은 법령이나 서비스의 변경사항을 반영하기 위하여 수시로 변경될 수 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>중요한 변경사항이 있을 경우, 서비스 내 공지사항을 통해 사전 고지합니다.</li>
            <li>변경된 개인정보 처리방침은 공지한 날로부터 효력이 발생합니다.</li>
            <li>사용자가 변경에 동의하지 않을 경우, 서비스 이용을 중단하고 회원탈퇴를 할 수 있습니다.</li>
          </ul>
          
          <div className="mt-6 p-6 bg-card border border-border rounded-lg">
            <h4 className="font-semibold mb-4">📅 변경 이력</h4>
            <div className="text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span>버전 {policyInfo.version}</span>
                <span>{policyInfo.lastUpdated}</span>
              </div>
              <div className="pt-2 text-muted-foreground">
                • 개인정보 처리방침 최초 제정
              </div>
            </div>
          </div>
        </div>
      </PrivacySection>

      {/* 하단 정보 */}
      <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>이 개인정보 처리방침은 <strong>{policyInfo.effectiveDate}</strong>부터 적용됩니다.</p>
        <p className="mt-2">{policyInfo.companyName} | 버전 {policyInfo.version}</p>
      </div>
    </div>
  );
}
