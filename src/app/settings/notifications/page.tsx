"use client"
import ContentSection from '@/components/content-section'
import { NotificationsForm } from './notification-form'

export default function SettingsNotifications() {
    return (
        <ContentSection
            title='Notifications'
            desc='Configure how you receive notifications.'
        >
            <NotificationsForm />
        </ContentSection>
    )
}