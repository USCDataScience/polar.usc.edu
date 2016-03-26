package edu.usc.polar;
import org.apache.wicket.markup.html.IPackageResourceGuard;
import org.apache.wicket.markup.html.SecurePackageResourceGuard;
import org.apache.wicket.protocol.http.WebApplication;
import org.apache.wicket.request.resource.*;
import org.apache.wicket.resource.TextTemplateResourceReference;
import org.apache.wicket.util.resource.IResourceStream;

public class PolarApplication extends WebApplication {
    public PolarApplication() {
    }
    /**
     * @see org.apache.wicket.Application#getHomePage()
     */
    @Override
    public Class getHomePage() {
        return Polar.class;
    }

    @Override
    protected void init() {
        super.init();

        IPackageResourceGuard guard = getResourceSettings().getPackageResourceGuard();
        if (guard instanceof SecurePackageResourceGuard) {
            SecurePackageResourceGuard sguard = (SecurePackageResourceGuard) guard;
            sguard.addPattern("+*.tsv");
            sguard.addPattern("+*.json");
            sguard.addPattern("+*.csv");
        }
    }
}