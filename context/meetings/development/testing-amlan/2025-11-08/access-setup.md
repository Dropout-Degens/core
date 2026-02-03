# Amlan Setup Session - 2025-11-08 Access Setup

## Email Configuration

| Type | Address | Notes |
|------|---------|-------|
| Dropout email | amlan@dropoutdegents.com | Forwarding address only |
| Forwards to | amlanpradhan124@gmail.com | Personal Gmail |

**Important:** The dropout email is NOT a Gmail account - it's just a Cloudflare email routing rule that forwards to personal email.

## System Access Granted

### Cloudflare
- **Account type:** Personal email (amlan24pradhan@gmail.com)
- **Access level:** Member of Bellcube Consortium
- **Can access:** dropoutdegents.com domain
- **Cannot access:** Other Bellcube domains (can see names, but no permissions)
- **Why personal email:** So Amlan can still access if domain goes down

### GitHub
- **Account:** Syracuse university email
- **Access level:** Member
- **Repositories visible:** 4 (all DD repos)
- **Invite sent:** November 2nd

### Stripe
- **Account:** Dropout email
- **Purpose:** Payment processor access
- **Note:** This is where subscription charges are managed

### Supabase
- **Account:** Created fresh (not via GitHub OAuth)
- **Purpose:** Database access
- **Note:** Could have used GitHub continue, but created separate account

### Google Cloud
- **Account:** New Google account using dropout email
- **Process:** Used "use existing email" option during Google account creation
- **Note:** Required because Google Cloud invites need a Google account

### Notion
- **Account:** Dropout email
- **Access level:** Full edit permissions
- **Note:** Did NOT use Google sign-in (not an organization account)

### Claude
- **Account:** Dropout email
- **Plan:** Pro ($20/month)
- **Payment:** Dax's card
- **Purpose:** AI assistance for development work
- **Note:** Keep separate from personal Claude to track company usage

### Discord
- **Role:** Developer
- **Issues:** Unable to tag in channels, no join message appeared
- **Workaround:** Group chat DM for communication
